import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function removeMarkdown(input: string): string {
  // 移除標題
  input = input.replaceAll(/^\#{1,6}\s+/gm, '');

  // 移除粗體和斜體
  input = input.replaceAll(/(\*\*|__)(.*?)\1/g, '$2'); // **粗體** 或 __粗體__
  input = input.replaceAll(/(\*|_)(.*?)\1/g, '$2');    // *斜體* 或 _斜體_

  // 移除鏈接
  input = input.replaceAll(/\[([^\]]+)\]\([^\)]+\)/g, '$1'); // [文本](鏈接)

  // 移除圖片
  input = input.replaceAll(/!\[([^\]]*)\]\([^\)]+\)/g, '$1'); // ![圖片](鏈接)

  // 移除區塊引用
  input = input.replaceAll(/^>\s+/gm, '');

  // 移除代碼區塊
  input = input.replaceAll(/```[\s\S]*?```/g, ''); // 多行代碼區塊
  input = input.replaceAll(/`([^`]+)`/g, '$1');     // 單行代碼

  // 移除水平線
  input = input.replaceAll(/^-{3,}|\*{3,}|_{3,}/g, '');

  return input;
}