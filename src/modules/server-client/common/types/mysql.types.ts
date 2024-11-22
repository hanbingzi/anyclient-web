import { IBaseSqlService, ISqlServiceClient } from './../index';
import { IDbDetail } from './common.types';

export const IMysqlServiceToken = Symbol('IMysqlServiceToken');

export interface IMysqlDbDetail extends IDbDetail {
  collate?: string;
}

export interface IMysqlService extends IBaseSqlService {}

export const IMysqlClientServicePath = 'IMysqlClientServicePath';

export const IMysqlClientService = Symbol('IMysqlClientService');

export interface IMysqlServiceClient extends ISqlServiceClient {}

export interface IMysqlCharsetConfig {
  defaultCollate: MySqlCollation;
  collations: MySqlCollation[];
}

export type MySqlCharset =
  | 'utf8mb3'
  | 'utf8mb4'
  | 'gbk'
  | 'utf16'
  | 'utf16le'
  | 'utf32'
  | 'latin1'
  | 'latin2'
  | 'latin5'
  | 'latin7'
  | 'armscii8'
  | 'ascii'
  | 'big5'
  | 'binary'
  | 'cp1250'
  | 'cp1251'
  | 'cp1256'
  | 'cp1257'
  | 'cp850'
  | 'cp852'
  | 'cp866'
  | 'cp932'
  | 'dec8'
  | 'eucjpms'
  | 'euckr'
  | 'gb18030'
  | 'gb2312'
  | 'geostd8'
  | 'greek'
  | 'hebrew'
  | 'hp8'
  | 'keybcs2'
  | 'koi8r'
  | 'koi8u'
  | 'macce'
  | 'macroman'
  | 'sjis'
  | 'swe7'
  | 'tis620'
  | 'ucs2'
  | 'ujis';

export type MySqlCollation =
  //@formatter:off
  | 'armscii8_bin'
  | 'armscii8_general_ci'
  | 'ascii_bin'
  | 'ascii_general_ci'
  | 'big5_bin'
  | 'big5_chinese_ci'
  | 'binary'
  | 'cp1250_bin'
  | 'cp1250_croatian_ci'
  | 'cp1250_czech_cs'
  | 'cp1250_general_ci'
  | 'cp1250_polish_ci'
  | 'cp1251_bin'
  | 'cp1251_bulgarian_ci'
  | 'cp1251_general_ci'
  | 'cp1251_general_cs'
  | 'cp1251_ukrainian_ci'
  | 'cp1256_bin'
  | 'cp1256_general_ci'
  | 'cp1257_bin'
  | 'cp1257_general_ci'
  | 'cp1257_lithuanian_ci'
  | 'cp850_bin'
  | 'cp850_general_ci'
  | 'cp852_bin'
  | 'cp852_general_ci'
  | 'cp866_bin'
  | 'cp866_general_ci'
  | 'cp932_bin'
  | 'cp932_japanese_ci'
  | 'dec8_bin'
  | 'dec8_swedish_ci'
  | 'eucjpms_bin'
  | 'eucjpms_japanese_ci'
  | 'euckr_bin'
  | 'euckr_korean_ci'
  | 'gb18030_bin'
  | 'gb18030_chinese_ci'
  | 'gb18030_unicode_520_ci'
  | 'gb2312_bin'
  | 'gb2312_chinese_ci'
  | 'gbk_bin'
  | 'gbk_chinese_ci'
  | 'geostd8_bin'
  | 'geostd8_general_ci'
  | 'greek_bin'
  | 'greek_general_ci'
  | 'hebrew_bin'
  | 'hebrew_general_ci'
  | 'hp8_bin'
  | 'hp8_english_ci'
  | 'keybcs2_bin'
  | 'keybcs2_general_ci'
  | 'koi8r_bin'
  | 'koi8r_general_ci'
  | 'koi8u_bin'
  | 'koi8u_general_ci'
  | 'latin1_bin'
  | 'latin1_danish_ci'
  | 'latin1_general_ci'
  | 'latin1_general_cs'
  | 'latin1_german1_ci'
  | 'latin1_german2_ci'
  | 'latin1_spanish_ci'
  | 'latin1_swedish_ci'
  | 'latin2_bin'
  | 'latin2_croatian_ci'
  | 'latin2_czech_cs'
  | 'latin2_general_ci'
  | 'latin2_hungarian_ci'
  | 'latin5_bin'
  | 'latin5_turkish_ci'
  | 'latin7_bin'
  | 'latin7_estonian_cs'
  | 'latin7_general_ci'
  | 'latin7_general_cs'
  | 'macce_bin'
  | 'macce_general_ci'
  | 'macroman_bin'
  | 'macroman_general_ci'
  | 'sjis_bin'
  | 'sjis_japanese_ci'
  | 'swe7_bin'
  | 'swe7_swedish_ci'
  | 'tis620_bin'
  | 'tis620_thai_ci'
  | 'ucs2_bin'
  | 'ucs2_croatian_ci'
  | 'ucs2_czech_ci'
  | 'ucs2_danish_ci'
  | 'ucs2_esperanto_ci'
  | 'ucs2_estonian_ci'
  | 'ucs2_general_ci'
  | 'ucs2_general_mysql500_ci'
  | 'ucs2_german2_ci'
  | 'ucs2_hungarian_ci'
  | 'ucs2_icelandic_ci'
  | 'ucs2_latvian_ci'
  | 'ucs2_lithuanian_ci'
  | 'ucs2_persian_ci'
  | 'ucs2_polish_ci'
  | 'ucs2_romanian_ci'
  | 'ucs2_roman_ci'
  | 'ucs2_sinhala_ci'
  | 'ucs2_slovak_ci'
  | 'ucs2_slovenian_ci'
  | 'ucs2_spanish2_ci'
  | 'ucs2_spanish_ci'
  | 'ucs2_swedish_ci'
  | 'ucs2_turkish_ci'
  | 'ucs2_unicode_520_ci'
  | 'ucs2_unicode_ci'
  | 'ucs2_vietnamese_ci'
  | 'ujis_bin'
  | 'ujis_japanese_ci'
  | 'utf16_bin'
  | 'utf16_croatian_ci'
  | 'utf16_czech_ci'
  | 'utf16_danish_ci'
  | 'utf16_esperanto_ci'
  | 'utf16_estonian_ci'
  | 'utf16_general_ci'
  | 'utf16_german2_ci'
  | 'utf16_hungarian_ci'
  | 'utf16_icelandic_ci'
  | 'utf16_latvian_ci'
  | 'utf16_lithuanian_ci'
  | 'utf16_persian_ci'
  | 'utf16_polish_ci'
  | 'utf16_romanian_ci'
  | 'utf16_roman_ci'
  | 'utf16_sinhala_ci'
  | 'utf16_slovak_ci'
  | 'utf16_slovenian_ci'
  | 'utf16_spanish2_ci'
  | 'utf16_spanish_ci'
  | 'utf16_swedish_ci'
  | 'utf16_turkish_ci'
  | 'utf16_unicode_520_ci'
  | 'utf16_unicode_ci'
  | 'utf16_vietnamese_ci'
  | 'utf16le_bin'
  | 'utf16le_general_ci'
  | 'utf32_bin'
  | 'utf32_croatian_ci'
  | 'utf32_czech_ci'
  | 'utf32_danish_ci'
  | 'utf32_esperanto_ci'
  | 'utf32_estonian_ci'
  | 'utf32_general_ci'
  | 'utf32_german2_ci'
  | 'utf32_hungarian_ci'
  | 'utf32_icelandic_ci'
  | 'utf32_latvian_ci'
  | 'utf32_lithuanian_ci'
  | 'utf32_persian_ci'
  | 'utf32_polish_ci'
  | 'utf32_romanian_ci'
  | 'utf32_roman_ci'
  | 'utf32_sinhala_ci'
  | 'utf32_slovak_ci'
  | 'utf32_slovenian_ci'
  | 'utf32_spanish2_ci'
  | 'utf32_spanish_ci'
  | 'utf32_swedish_ci'
  | 'utf32_turkish_ci'
  | 'utf32_unicode_520_ci'
  | 'utf32_unicode_ci'
  | 'utf32_vietnamese_ci'
  | 'utf8mb3_bin'
  | 'utf8mb3_croatian_ci'
  | 'utf8mb3_czech_ci'
  | 'utf8mb3_danish_ci'
  | 'utf8mb3_esperanto_ci'
  | 'utf8mb3_estonian_ci'
  | 'utf8mb3_general_ci'
  | 'utf8mb3_general_mysql500_ci'
  | 'utf8mb3_german2_ci'
  | 'utf8mb3_hungarian_ci'
  | 'utf8mb3_icelandic_ci'
  | 'utf8mb3_latvian_ci'
  | 'utf8mb3_lithuanian_ci'
  | 'utf8mb3_persian_ci'
  | 'utf8mb3_polish_ci'
  | 'utf8mb3_romanian_ci'
  | 'utf8mb3_roman_ci'
  | 'utf8mb3_sinhala_ci'
  | 'utf8mb3_slovak_ci'
  | 'utf8mb3_slovenian_ci'
  | 'utf8mb3_spanish2_ci'
  | 'utf8mb3_spanish_ci'
  | 'utf8mb3_swedish_ci'
  | 'utf8mb3_tolower_ci'
  | 'utf8mb3_turkish_ci'
  | 'utf8mb3_unicode_520_ci'
  | 'utf8mb3_unicode_ci'
  | 'utf8mb3_vietnamese_ci'
  | 'utf8mb4_0900_ai_ci'
  | 'utf8mb4_0900_as_ci'
  | 'utf8mb4_0900_as_cs'
  | 'utf8mb4_0900_bin'
  | 'utf8mb4_bg_0900_ai_ci'
  | 'utf8mb4_bg_0900_as_cs'
  | 'utf8mb4_bin'
  | 'utf8mb4_bs_0900_ai_ci'
  | 'utf8mb4_bs_0900_as_cs'
  | 'utf8mb4_croatian_ci'
  | 'utf8mb4_cs_0900_ai_ci'
  | 'utf8mb4_cs_0900_as_cs'
  | 'utf8mb4_czech_ci'
  | 'utf8mb4_danish_ci'
  | 'utf8mb4_da_0900_ai_ci'
  | 'utf8mb4_da_0900_as_cs'
  | 'utf8mb4_de_pb_0900_ai_ci'
  | 'utf8mb4_de_pb_0900_as_cs'
  | 'utf8mb4_eo_0900_ai_ci'
  | 'utf8mb4_eo_0900_as_cs'
  | 'utf8mb4_esperanto_ci'
  | 'utf8mb4_estonian_ci'
  | 'utf8mb4_es_0900_ai_ci'
  | 'utf8mb4_es_0900_as_cs'
  | 'utf8mb4_es_trad_0900_ai_ci'
  | 'utf8mb4_es_trad_0900_as_cs'
  | 'utf8mb4_et_0900_ai_ci'
  | 'utf8mb4_et_0900_as_cs'
  | 'utf8mb4_general_ci'
  | 'utf8mb4_german2_ci'
  | 'utf8mb4_gl_0900_ai_ci'
  | 'utf8mb4_gl_0900_as_cs'
  | 'utf8mb4_hr_0900_ai_ci'
  | 'utf8mb4_hr_0900_as_cs'
  | 'utf8mb4_hungarian_ci'
  | 'utf8mb4_hu_0900_ai_ci'
  | 'utf8mb4_hu_0900_as_cs'
  | 'utf8mb4_icelandic_ci'
  | 'utf8mb4_is_0900_ai_ci'
  | 'utf8mb4_is_0900_as_cs'
  | 'utf8mb4_ja_0900_as_cs'
  | 'utf8mb4_ja_0900_as_cs_ks'
  | 'utf8mb4_latvian_ci'
  | 'utf8mb4_la_0900_ai_ci';
//@formatter:on

/**
 * 数据获取来源：
 * select t1.CHARACTER_SET_NAME,t1.collate_array,t2.DEFAULT_COLLATE_NAME,
 * CONCAT('\'',t1.CHARACTER_SET_NAME,'\': {defaultCollate: \'',t2.DEFAULT_COLLATE_NAME,'\', collations: [\'',t1.collate_array,'\']},')
 *  from (select a.CHARACTER_SET_NAME ,GROUP_CONCAT(DISTINCT a.COLLATION_NAME SEPARATOR '\',\'') AS collate_array
 * from collations a GROUP BY a.CHARACTER_SET_NAME) t1
 * left join character_sets t2 on t1.CHARACTER_SET_NAME=t2.CHARACTER_SET_NAME;
 */

export const MysqlCharsetConfig: { [key in MySqlCharset]: IMysqlCharsetConfig } = {
  utf8mb4: {
    defaultCollate: 'utf8mb4_0900_ai_ci',
    collations: [
      'utf8mb4_0900_ai_ci',
      'utf8mb4_0900_as_ci',
      'utf8mb4_0900_as_cs',
      'utf8mb4_0900_bin',
      'utf8mb4_bg_0900_ai_ci',
      'utf8mb4_bg_0900_as_cs',
      'utf8mb4_bin',
      'utf8mb4_bs_0900_ai_ci',
      'utf8mb4_bs_0900_as_cs',
      'utf8mb4_croatian_ci',
      'utf8mb4_cs_0900_ai_ci',
      'utf8mb4_cs_0900_as_cs',
      'utf8mb4_czech_ci',
      'utf8mb4_danish_ci',
      'utf8mb4_da_0900_ai_ci',
      'utf8mb4_da_0900_as_cs',
      'utf8mb4_de_pb_0900_ai_ci',
      'utf8mb4_de_pb_0900_as_cs',
      'utf8mb4_eo_0900_ai_ci',
      'utf8mb4_eo_0900_as_cs',
      'utf8mb4_esperanto_ci',
      'utf8mb4_estonian_ci',
      'utf8mb4_es_0900_ai_ci',
      'utf8mb4_es_0900_as_cs',
      'utf8mb4_es_trad_0900_ai_ci',
      'utf8mb4_es_trad_0900_as_cs',
      'utf8mb4_et_0900_ai_ci',
      'utf8mb4_et_0900_as_cs',
      'utf8mb4_general_ci',
      'utf8mb4_german2_ci',
      'utf8mb4_gl_0900_ai_ci',
      'utf8mb4_gl_0900_as_cs',
      'utf8mb4_hr_0900_ai_ci',
      'utf8mb4_hr_0900_as_cs',
      'utf8mb4_hungarian_ci',
      'utf8mb4_hu_0900_ai_ci',
      'utf8mb4_hu_0900_as_cs',
      'utf8mb4_icelandic_ci',
      'utf8mb4_is_0900_ai_ci',
      'utf8mb4_is_0900_as_cs',
      'utf8mb4_ja_0900_as_cs',
      'utf8mb4_ja_0900_as_cs_ks',
      'utf8mb4_latvian_ci',
      'utf8mb4_la_0900_ai_ci',
    ],
  },
  utf8mb3: {
    defaultCollate: 'utf8mb3_general_ci',
    collations: [
      'utf8mb3_bin',
      'utf8mb3_croatian_ci',
      'utf8mb3_czech_ci',
      'utf8mb3_danish_ci',
      'utf8mb3_esperanto_ci',
      'utf8mb3_estonian_ci',
      'utf8mb3_general_ci',
      'utf8mb3_general_mysql500_ci',
      'utf8mb3_german2_ci',
      'utf8mb3_hungarian_ci',
      'utf8mb3_icelandic_ci',
      'utf8mb3_latvian_ci',
      'utf8mb3_lithuanian_ci',
      'utf8mb3_persian_ci',
      'utf8mb3_polish_ci',
      'utf8mb3_romanian_ci',
      'utf8mb3_roman_ci',
      'utf8mb3_sinhala_ci',
      'utf8mb3_slovak_ci',
      'utf8mb3_slovenian_ci',
      'utf8mb3_spanish2_ci',
      'utf8mb3_spanish_ci',
      'utf8mb3_swedish_ci',
      'utf8mb3_tolower_ci',
      'utf8mb3_turkish_ci',
      'utf8mb3_unicode_520_ci',
      'utf8mb3_unicode_ci',
      'utf8mb3_vietnamese_ci',
    ],
  },

  utf16: {
    defaultCollate: 'utf16_general_ci',
    collations: [
      'utf16_bin',
      'utf16_croatian_ci',
      'utf16_czech_ci',
      'utf16_danish_ci',
      'utf16_esperanto_ci',
      'utf16_estonian_ci',
      'utf16_general_ci',
      'utf16_german2_ci',
      'utf16_hungarian_ci',
      'utf16_icelandic_ci',
      'utf16_latvian_ci',
      'utf16_lithuanian_ci',
      'utf16_persian_ci',
      'utf16_polish_ci',
      'utf16_romanian_ci',
      'utf16_roman_ci',
      'utf16_sinhala_ci',
      'utf16_slovak_ci',
      'utf16_slovenian_ci',
      'utf16_spanish2_ci',
      'utf16_spanish_ci',
      'utf16_swedish_ci',
      'utf16_turkish_ci',
      'utf16_unicode_520_ci',
      'utf16_unicode_ci',
      'utf16_vietnamese_ci',
    ],
  },
  utf16le: { defaultCollate: 'utf16le_general_ci', collations: ['utf16le_bin', 'utf16le_general_ci'] },
  utf32: {
    defaultCollate: 'utf32_general_ci',
    collations: [
      'utf32_bin',
      'utf32_croatian_ci',
      'utf32_czech_ci',
      'utf32_danish_ci',
      'utf32_esperanto_ci',
      'utf32_estonian_ci',
      'utf32_general_ci',
      'utf32_german2_ci',
      'utf32_hungarian_ci',
      'utf32_icelandic_ci',
      'utf32_latvian_ci',
      'utf32_lithuanian_ci',
      'utf32_persian_ci',
      'utf32_polish_ci',
      'utf32_romanian_ci',
      'utf32_roman_ci',
      'utf32_sinhala_ci',
      'utf32_slovak_ci',
      'utf32_slovenian_ci',
      'utf32_spanish2_ci',
      'utf32_spanish_ci',
      'utf32_swedish_ci',
      'utf32_turkish_ci',
      'utf32_unicode_520_ci',
      'utf32_unicode_ci',
      'utf32_vietnamese_ci',
    ],
  },

  gb2312: { defaultCollate: 'gb2312_chinese_ci', collations: ['gb2312_bin', 'gb2312_chinese_ci'] },
  gbk: { defaultCollate: 'gbk_chinese_ci', collations: ['gbk_bin', 'gbk_chinese_ci'] },

  latin1: {
    defaultCollate: 'latin1_swedish_ci',
    collations: [
      'latin1_bin',
      'latin1_danish_ci',
      'latin1_general_ci',
      'latin1_general_cs',
      'latin1_german1_ci',
      'latin1_german2_ci',
      'latin1_spanish_ci',
      'latin1_swedish_ci',
    ],
  },
  latin2: {
    defaultCollate: 'latin2_general_ci',
    collations: ['latin2_bin', 'latin2_croatian_ci', 'latin2_czech_cs', 'latin2_general_ci', 'latin2_hungarian_ci'],
  },
  latin5: { defaultCollate: 'latin5_turkish_ci', collations: ['latin5_bin', 'latin5_turkish_ci'] },
  latin7: {
    defaultCollate: 'latin7_general_ci',
    collations: ['latin7_bin', 'latin7_estonian_cs', 'latin7_general_ci', 'latin7_general_cs'],
  },

  armscii8: { defaultCollate: 'armscii8_general_ci', collations: ['armscii8_bin', 'armscii8_general_ci'] },
  ascii: { defaultCollate: 'ascii_general_ci', collations: ['ascii_bin', 'ascii_general_ci'] },
  big5: { defaultCollate: 'big5_chinese_ci', collations: ['big5_bin', 'big5_chinese_ci'] },
  binary: { defaultCollate: 'binary', collations: ['binary'] },
  cp1250: {
    defaultCollate: 'cp1250_general_ci',
    collations: ['cp1250_bin', 'cp1250_croatian_ci', 'cp1250_czech_cs', 'cp1250_general_ci', 'cp1250_polish_ci'],
  },
  cp1251: {
    defaultCollate: 'cp1251_general_ci',
    collations: ['cp1251_bin', 'cp1251_bulgarian_ci', 'cp1251_general_ci', 'cp1251_general_cs', 'cp1251_ukrainian_ci'],
  },
  cp1256: { defaultCollate: 'cp1256_general_ci', collations: ['cp1256_bin', 'cp1256_general_ci'] },
  cp1257: {
    defaultCollate: 'cp1257_general_ci',
    collations: ['cp1257_bin', 'cp1257_general_ci', 'cp1257_lithuanian_ci'],
  },
  cp850: { defaultCollate: 'cp850_general_ci', collations: ['cp850_bin', 'cp850_general_ci'] },
  cp852: { defaultCollate: 'cp852_general_ci', collations: ['cp852_bin', 'cp852_general_ci'] },
  cp866: { defaultCollate: 'cp866_general_ci', collations: ['cp866_bin', 'cp866_general_ci'] },
  cp932: { defaultCollate: 'cp932_japanese_ci', collations: ['cp932_bin', 'cp932_japanese_ci'] },
  dec8: { defaultCollate: 'dec8_swedish_ci', collations: ['dec8_bin', 'dec8_swedish_ci'] },
  eucjpms: { defaultCollate: 'eucjpms_japanese_ci', collations: ['eucjpms_bin', 'eucjpms_japanese_ci'] },
  euckr: { defaultCollate: 'euckr_korean_ci', collations: ['euckr_bin', 'euckr_korean_ci'] },
  gb18030: {
    defaultCollate: 'gb18030_chinese_ci',
    collations: ['gb18030_bin', 'gb18030_chinese_ci', 'gb18030_unicode_520_ci'],
  },

  geostd8: { defaultCollate: 'geostd8_general_ci', collations: ['geostd8_bin', 'geostd8_general_ci'] },
  greek: { defaultCollate: 'greek_general_ci', collations: ['greek_bin', 'greek_general_ci'] },
  hebrew: { defaultCollate: 'hebrew_general_ci', collations: ['hebrew_bin', 'hebrew_general_ci'] },
  hp8: { defaultCollate: 'hp8_english_ci', collations: ['hp8_bin', 'hp8_english_ci'] },
  keybcs2: { defaultCollate: 'keybcs2_general_ci', collations: ['keybcs2_bin', 'keybcs2_general_ci'] },
  koi8r: { defaultCollate: 'koi8r_general_ci', collations: ['koi8r_bin', 'koi8r_general_ci'] },
  koi8u: { defaultCollate: 'koi8u_general_ci', collations: ['koi8u_bin', 'koi8u_general_ci'] },

  macce: { defaultCollate: 'macce_general_ci', collations: ['macce_bin', 'macce_general_ci'] },
  macroman: { defaultCollate: 'macroman_general_ci', collations: ['macroman_bin', 'macroman_general_ci'] },
  sjis: { defaultCollate: 'sjis_japanese_ci', collations: ['sjis_bin', 'sjis_japanese_ci'] },
  swe7: { defaultCollate: 'swe7_swedish_ci', collations: ['swe7_bin', 'swe7_swedish_ci'] },
  tis620: { defaultCollate: 'tis620_thai_ci', collations: ['tis620_bin', 'tis620_thai_ci'] },
  ucs2: {
    defaultCollate: 'ucs2_general_ci',
    collations: [
      'ucs2_bin',
      'ucs2_croatian_ci',
      'ucs2_czech_ci',
      'ucs2_danish_ci',
      'ucs2_esperanto_ci',
      'ucs2_estonian_ci',
      'ucs2_general_ci',
      'ucs2_general_mysql500_ci',
      'ucs2_german2_ci',
      'ucs2_hungarian_ci',
      'ucs2_icelandic_ci',
      'ucs2_latvian_ci',
      'ucs2_lithuanian_ci',
      'ucs2_persian_ci',
      'ucs2_polish_ci',
      'ucs2_romanian_ci',
      'ucs2_roman_ci',
      'ucs2_sinhala_ci',
      'ucs2_slovak_ci',
      'ucs2_slovenian_ci',
      'ucs2_spanish2_ci',
      'ucs2_spanish_ci',
      'ucs2_swedish_ci',
      'ucs2_turkish_ci',
      'ucs2_unicode_520_ci',
      'ucs2_unicode_ci',
      'ucs2_vietnamese_ci',
    ],
  },
  ujis: { defaultCollate: 'ujis_japanese_ci', collations: ['ujis_bin', 'ujis_japanese_ci'] },
};

export const MysqlCharsetArray: MySqlCharset[] = Object.keys(MysqlCharsetConfig) as MySqlCharset[];
