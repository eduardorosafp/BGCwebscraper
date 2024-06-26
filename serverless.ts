import type { AWS } from "@serverless/typescript";
import * as dotenv from "dotenv";

dotenv.config();

interface CustomAWS extends AWS {
  provider: AWS["provider"] & {
    accessKeyId?: string;
    secretAccessKey?: string;
  };
}

const serverlessConfiguration: CustomAWS = {
  service: "BGCWebScraper",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild"],
  provider: {
    name: "aws", 
    region: "us-east-2",
    runtime: "nodejs20.x",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
    },
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
  functions: {},
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
  },
};

export default serverlessConfiguration;
