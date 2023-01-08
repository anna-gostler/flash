import { Injectable } from '@angular/core';
import * as Tesseract from 'tesseract.js';

@Injectable({
  providedIn: 'root',
})
export class OcrService {
  constructor() {}

  async ocr(image: any, languageCode: string): Promise<string> {
    const value = await Tesseract.recognize(image, languageCode);
    console.log(value.data.text);
    return value.data.text;
  }
}
