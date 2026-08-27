import CryptoJS from "crypto-js";

/**
 * AES 加解密工具（CBC 模式 + Pkcs7 填充，输出 Base64）
 *
 * 密钥与偏移量：16 位字符串（16 字节 = 128 位，满足 AES-128）
 * 说明：key / iv 为占位值，接入后端时请替换为后端约定的同一组密钥，
 *      并保证前后端解析方式一致（UTF-8 编码的 16 字节）。
 */

// 16 位密钥 / 偏移量（占位，请按后端约定修改）
const AES_KEY = CryptoJS.enc.Utf8.parse("1234567890abcdef");
const AES_IV = CryptoJS.enc.Utf8.parse("1234567890abcdef");

// 统一加解密配置
const AES_OPTIONS = {
  iv: AES_IV,
  mode: CryptoJS.mode.CBC,
  padding: CryptoJS.pad.Pkcs7,
};

/**
 * AES 加密
 * @param plainText 明文（手机号 / 验证码 / 密码等字符串）
 * @returns Base64 密文
 */
export function Encrypt(plainText: string): string {
  return CryptoJS.AES.encrypt(plainText, AES_KEY, AES_OPTIONS).toString();
}

/**
 * AES 解密
 * @param cipherText Base64 密文
 * @returns 明文
 */
export function Decrypt(cipherText: string): string {
  return CryptoJS.AES.decrypt(cipherText, AES_KEY, AES_OPTIONS).toString(
    CryptoJS.enc.Utf8,
  );
}
