import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware.js';
import { OpenRouter } from '@openrouter/sdk';
import axios from 'axios';
import cloudinary from '../config/cloudinary.js';
import { Generation } from '../models/generation.js';
import { Post } from '../models/post.js';


// POST /api/posts/generate
export const generatePost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { prompt, tone, generateImage } = req.body;
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      res.status(400).json({ message: 'OpenRouter API key is missing. Please add it to your server env file' });
      return;
    }

    const openrouter = new OpenRouter({ apiKey });

    // Generate Text
    const textResponse = await openrouter.chat.send({
      chatRequest: {
        model: 'openrouter/owl-alpha',
        messages: [
          {
            role: 'user',
            content: `generate a social media post based on this prompt: "${prompt}". tone: ${tone}. format the response as JSON with content, imagePrompt, and hashtags (an array of strings without the '#' symbol, e.g. ["AI", "WebDev"]) fields. the imagePrompt should be a highly descriptive prompt for an image generator that complements the post. do not include hashtags inside the content field; return them separately in the hashtags field.`
          }
        ]
      }
    });

    let content = '';
    let imagePrompt = prompt;
    let hashtags: string[] = [];

    try {
      const rawText = (textResponse as any).choices?.[0]?.message?.content || '';
      const jsonMatch = rawText.match(/```json\s*([\s\S]*?)```/);
      const data = jsonMatch ? JSON.parse(jsonMatch[1]!) : { content: rawText, imagePrompt: prompt || '', hashtags: [] };
      
      content = data.content;
      imagePrompt = data.imagePrompt;
      hashtags = data.hashtags || [];
    } catch (e) {
      content = (textResponse as any).choices?.[0]?.message?.content || '';
    }

    let mediaUrl = '';

    // Use Hugging Face for image generation, fallback to Pollinations.ai
    if (generateImage) {
      try {
        const hfToken = process.env.HF_ACCESS_TOKEN;
        let tempUrl = '';

        if (hfToken && hfToken !== 'your_hugging_face_token_here') {
          // Hugging Face Inference API - Free, High-quality SDXL
          const hfResponse = await axios.post(
            'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0',
            { inputs: imagePrompt },
            {
              headers: { Authorization: `Bearer ${hfToken}` },
              responseType: 'arraybuffer'
            }
          );
          const base64Image = Buffer.from(hfResponse.data, 'binary').toString('base64');
          tempUrl = `data:image/jpeg;base64,${base64Image}`;
        } else {
          // Fallback to Pollinations.ai - Free, No key, Fast
          const seed = Math.floor(Math.random() * 1000000);
          tempUrl = `https://image.pollinations.ai/p/${encodeURIComponent(imagePrompt)}?width=1024&height=1024&nologo=true&seed=${seed}`;
        }

        if (tempUrl) {
          // Upload to Cloudinary for persistence
          const uploadResult = await cloudinary.uploader.upload(tempUrl, {
            folder: 'ai_generations'
          });
          mediaUrl = uploadResult.secure_url;
        }
      } catch (error: any) {
        console.error('image generation failed, trying Pollinations.ai fallback...', error);
        // Instant fallback to Pollinations.ai if HF fails
        try {
          const seed = Math.floor(Math.random() * 1000000);
          const fallbackUrl = `https://image.pollinations.ai/p/${encodeURIComponent(imagePrompt)}?width=1024&height=1024&nologo=true&seed=${seed}`;
          const uploadResult = await cloudinary.uploader.upload(fallbackUrl, {
            folder: 'ai_generations'
          });
          mediaUrl = uploadResult.secure_url;
        } catch (fallbackError) {
          console.error('fallback image generation also failed', fallbackError);
        }
      }
    }

    // Save generation to DB
    const generation = await Generation.create({
      user: req.user.id,
      prompt,
      content,
      mediaUrl,
      mediaType: mediaUrl ? 'image' : undefined,
      tone: tone || undefined,
      hashtags
    });

    res.json(generation);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// GET /api/posts/generations
export const getGenerations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const generations = await Generation.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(generations);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// GET /api/posts
export const getPosts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const posts = await Post.find({ user: req.user.id });
    res.json(posts);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// POST /api/posts
export const schedulePost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { content, platforms, scheduledFor, status } = req.body;
    
    // Parse platforms if it comes as a stringified array from FormData
    let parsedPlatforms = platforms;
    if (typeof platforms === 'string') {
      try {
        parsedPlatforms = JSON.parse(platforms);
      } catch (e) {
        parsedPlatforms = platforms.split(',');
      }
    }

    const platformMapping: Record<string, string> = {
      'twitter': 'Twitter',
      'linkedin': 'LinkedIn',
      'facebook': 'Facebook',
      'instagram': 'Instagram'
    };

    const mappedPlatforms = (Array.isArray(parsedPlatforms) ? parsedPlatforms : []).map(
      (p: string) => platformMapping[p.toLowerCase()] || p
    );

    let mediaUrl: string | undefined = req.body.mediaUrl;
    let mediaType: 'image' | 'video' | undefined = req.body.mediaType;

    if (req.file) {
      const result = await new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: 'auto', folder: 'scheduler' },
          (error: any, result: any) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
        stream.end(req.file!.buffer);
      });

      mediaUrl = result.secure_url;
      mediaType = result.resource_type === 'video' ? 'video' : 'image';
    }

    const post = await Post.create({
      user: req.user.id,
      content,
      platforms: mappedPlatforms,
      mediaUrl,
      mediaType,
      scheduledFor,
      status
    });

    res.status(201).json(post);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// DELETE /api/posts/:id
export const deletePost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const post = await Post.findOne({ _id: req.params.id, user: req.user.id });

    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    await post.deleteOne();
    res.json({ message: 'Post deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// DELETE /api/posts/generations/:id
export const deleteGeneration = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const generation = await Generation.findOne({ _id: req.params.id, user: req.user.id });

    if (!generation) {
      res.status(404).json({ message: 'Generation not found' });
      return;
    }

    await generation.deleteOne();
    res.json({ message: 'Generation deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};