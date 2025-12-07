import { ClientConfiguration, TikTokShopNodeApiClient,AccessTokenTool } from ".";
import * as dotenv from 'dotenv';
// Load environment variables
dotenv.config();

ClientConfiguration.globalConfig.app_key = process.env.TTS_APP_KEY!;
ClientConfiguration.globalConfig.app_secret = process.env.TTS_APP_SECRET!;
const access_token = process.env.TTS_APP_ACCESS_TOKEN!;

const client = new TikTokShopNodeApiClient({
  config: {
    sandbox: false,
  },
});

const main = async () => {
    const result = await client.api.ProductV202502Api.ProductsSearchPost(
      1,
      access_token,
      'application/json',
      undefined,
      undefined
    );
    console.log('resp data := ',JSON.stringify(result.body, null, 2));
};

if (require.main === module) {
  main();
}

export default client;