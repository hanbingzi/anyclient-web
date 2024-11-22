export class Pattern {
  public static TABLE_PATTERN = '\\b(from|join|update|into)\\b\\s*\\[?((\\w|\\.|-|`|"|\')+)\\]?';

  public static SELECT_TABLE_PATTERN = '\\b(from|join)\\b\\s*\\[?((\\w|\\.|-|`|"|\')+)\\]?';
  public static DML_PATTERN = '\\b(update|into)\\b\\s*`{0,1}(\\w|\\.|-)+`{0,1}';
  public static MULTI_PATTERN = /\b(TRIGGER|PROCEDURE|FUNCTION)\b/gi;
}
