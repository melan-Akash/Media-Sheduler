import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware.js';
import { OpenRouter } from '@openrouter/sdk';
import axios from 'axios';
import cloudinary from '../config/cloudinary.js';
import { Generation } from '../models/generation.js';
import { Post } from '../models/post.js';

// Helper to poll Leonardo.ai for image generation status
const pollLeonardoJob = async (generationId: string, apiKey: string): Promise<string> => {
  const maxRetries = 20;
  const delay = 5000;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await axios.get(`https://cloud.leonardo.ai/api/rest/v1/generations/${generationId}`, {
        headers: {
          accept: 'application/json',
          authorization: `Bearer ${apiKey}`
        }
      });
      
      const generation = response.data.generations_by_pk;
      
      if (generation.status === 'COMPLETE') {
        if (generation.generated_images && generation.generated_images.length > 0) {
          return generation.generated_images.url;
        }
        throw new Error('generation complete but no image found');
      }
      
      if (generation.status === 'FAILED') {
        throw new Error('Leonardo.ai generation failed');
      }
      
    } catch (error: any) {
      console.error('polling error', error.response?.data || error.message);
    }
    
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
  
  throw new Error('Leonardo.ai generation timeout');
};

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
            content: `generate a social media post based on this prompt: "${prompt}". tone: ${tone}. include relevant hashtags. format the response as JSON with content and imagePrompt fields. the imagePrompt should be a highly descriptive prompt for an image generator that complements the post.`
          }
        ]
      }
    });

    let content = '';
    let imagePrompt = prompt;

    try {
      const rawText = (textResponse as any).choices?.[0]?.message?.content || '';
      const jsonMatch = rawText.match(/```json\s*([\s\S]*?)```/);
      const data = jsonMatch ? JSON.parse(jsonMatch[1]!) : { content: rawText, imagePrompt: prompt || '' };
      
      content = data.content;
      imagePrompt = data.imagePrompt;
    } catch (e) {
      content = textResponse.choices[0]?.message?.content || '';
    }

    let mediaUrl = '';

    // Use Leonardo.ai for image generation, fallback to Pollinations.ai (100% Free, no key required)
    if (generateImage) {
      try {
        const leonardoKey = process.env.LEONARDO_API_KEY;
        let tempUrl = '';

        if (leonardoKey && leonardoKey !== 'your_leonardo_ai_key_here') {
          const leoResponse = await axios.post('https://cloud.leonardo.ai/api/rest/v1/generations', {
            public: false,
            modelId: '6b645e3a-d64f-4341-a6d8-7a3690fbf042',
            quality: 'LOW',
            prompt: imagePrompt,
            num_images: 1,
            width: 1024,
            height: 1024,
            promptMagic: false
          }, {
            headers: {
              accept: 'application/json',
              authorization: `Bearer ${leonardoKey}`,
              'content-type': 'application/json'
            }
          });
          
          const generationId = leoResponse.data.sdGenerationJob.generationId;
          tempUrl = await pollLeonardoJob(generationId, leonardoKey);
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
        console.error('image generation failed', error);
      }
    }

    // Save generation to DB
    const generation = await Generation.create({
      user: req.user.id,
      prompt,
      content,
      mediaUrl,
      mediaType: mediaUrl ? 'image' : undefined,
      tone: tone || undefined
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
      platforms: parsedPlatforms,
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