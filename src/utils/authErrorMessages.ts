export function authErrorToChinese(message: string) {
  const normalized = message.toLowerCase();

  if (normalized.includes('invalid login credentials')) {
    return '邮箱或密码不正确，请检查后再试一次。';
  }

  if (normalized.includes('email not confirmed')) {
    return '这个邮箱还没有完成验证，请先打开邮件里的确认链接。';
  }

  if (normalized.includes('user already registered') || normalized.includes('already been registered')) {
    return '这个邮箱已经注册过了，可以直接登录。';
  }

  if (normalized.includes('password')) {
    return '密码不符合要求，请至少输入 8 位。';
  }

  if (normalized.includes('email')) {
    return '邮箱格式看起来不太对，请重新检查。';
  }

  if (normalized.includes('rate limit')) {
    return '请求太频繁了，请稍后再试。';
  }

  return message || '操作没有成功，请稍后再试。';
}
