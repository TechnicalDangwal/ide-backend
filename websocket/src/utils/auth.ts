
async function wsAuthMiddleware(ws: globalThis.WebSocket, req: any) {
  try {
    const cookie = req.headers.cookie;

    if (!cookie) {
      ws.close(1008, "No cookie");
      return false;
    }

    const res = await fetch("http://auth-service:3000/api/v1/auth/verify", {
      headers: { Cookie: cookie },
    });

    if (!res.ok) {
      ws.close(1008, "Unauthorized");
      return false;
    }
    console.log(res.headers.get('x-user-id'));
    req.userId = res.headers.get('x-user-id')
    return true;    // authenticated
  } catch (err) {
    console.error("WebSocket auth error:", err);
    ws.close(1011, "Auth error"); // 1011 = internal error
    return false;
  }
}

export default wsAuthMiddleware
