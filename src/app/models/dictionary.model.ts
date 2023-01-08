export interface JishoDictionaryEntry {
  data: JishoDataEntry[];
}

interface JishoDataEntry {
  slug: string;
  is_common: boolean;
  jlpt: string[];
  tags: string[];
  japanese: JishoJapaneseEntry[];
  senses: JishoSensesEntry[];
}

interface JishoJapaneseEntry {
  word: string;
  reading: string;
}

interface JishoSensesEntry {
  english_definitions: string[]; 
  parts_of_speech: string[];
}