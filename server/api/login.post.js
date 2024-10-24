export default eventHandler(async (event) => {
  try {
    await checkLoad();
  } catch (error) {
    console.log("SSO 配置加载失败:", error);
    return { statusCode: 500, statusMessage: "Internal Server Error" };
  }

  const body = await readBody(event);
  
  let decrypted;

  try {
    const header = Buffer.from(body.h, "base64url");
    const bodyData = Buffer.from(body.b, "base64url");
    const decryptedData = await ssoDecrypt({ header, body: bodyData });
    if (!decryptedData) {
      throw new Error("解密失败");
    }
    decrypted = JSON.parse(decryptedData.toString());
    console.log("解密成功，解密后的数据:", decrypted);
  } catch (error) {
    console.log("SSO解密或解析错误:", error);
    return { statusCode: 400, statusMessage: "错误请求" };
  }

  if (!decrypted) {
    console.log("解密后的数据为空");
    return { statusCode: 400, statusMessage: "错误请求" };
  }

  if (!Number.isSafeInteger(decrypted.t) || Date.now() > decrypted.t + 60000) {
    console.log("时间戳无效或已过期");
    return { statusCode: 400, statusMessage: "错误请求" };
  }

  const userData = { username: undefined, avatar: undefined };

  decrypted.p.forEach(prop => {
    if (prop.p === 3) userData.avatar = prop.r;
    if (prop.p === 2) userData.username = prop.r;
  });

  console.log("用户数据:", userData);
  return userData;
});