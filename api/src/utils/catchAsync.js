// File: api/src/utils/catchAsync.js
export const catchAsync = (fn) => {
  return (req, res, next) => {
    // 🔍 添加详细日志
    Promise.resolve(fn(req, res, next)).catch((error) => {
      // ⭐ 关键：必须记录错误日志
      console.error('=== catchAsync 捕获错误 ===');
      console.error('路径:', req.method, req.originalUrl);
      console.error('请求体:', JSON.stringify(req.body, null, 2));
      console.error('错误类型:', error.constructor.name);
      console.error('错误消息:', error.message);
      console.error('错误代码:', error.code);
      console.error('错误堆栈:', error.stack);

      if (error.meta) {
        console.error('Prisma 元数据:', JSON.stringify(error.meta, null, 2));
      }

      // 传递给错误处理中间件
      next(error);
    });
  };
};
