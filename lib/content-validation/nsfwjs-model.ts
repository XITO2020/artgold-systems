// nsfwjs-model.ts
import * as nsfw from 'nsfwjs';

export class NsfwjsModel {
  private static instance: NsfwjsModel;
  private model: any;

  private constructor() {
    this.model = nsfw.loadModel();
  }

  static async getInstance() {
    if (!NsfwjsModel.instance) {
      NsfwjsModel.instance = new NsfwjsModel();
      await NsfwjsModel.instance.model;
    }
    return NsfwjsModel.instance;
  }

  async classify(imageBuffer: Buffer) {
    const image = await this.loadImage(imageBuffer);
    const predictions = await this.model.classify(image);
    return predictions;
  }

  private async loadImage(imageBuffer: Buffer) {
    const blob = new Blob([imageBuffer]);
    const url = URL.createObjectURL(blob);
    const image = new Image();
    image.src = url;
    await new Promise((resolve) => {
      image.onload = resolve;
    });
    return image;
  }
}
