/** 경로 탈출에 사용되는 문자만 제거하고, 한글을 포함한 일반적인 파일명은 보존합니다. */
export function safeFileName(value: string) {
  return value
    .normalize('NFC')
    .replace(/[\\/:*?"<>|]/g, '_')
    .replace(/\.\./g, '_')
    .replace(/[\u0000-\u001f\u007f]/g, '_')
    .trim()
}
