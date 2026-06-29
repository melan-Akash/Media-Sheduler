import { Zernio } from '@zernio/node';
const zero = new Zernio({
    apiKey: process.env.ZIO_API_KEY || process.env.ZERNIO_API_KEY || "",
    baseURL: "https://zernio.com/api"
});
export default zero;
//# sourceMappingURL=zuo.js.map