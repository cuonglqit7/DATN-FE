export async function POST(request: Request) {
  const res = await request.json();

  const sessionToken = (await res.payload.access_token) as string;

  if (!sessionToken) {
    return Response.json(
      { message: "Không nhận được session token" },
      { status: 400 }
    );
  }

  return Response.json(res.payload, {
    status: 200,
    headers: {
      "Set-Cookie": `sessionToken=${sessionToken}; Path=/; HttpOnly`,
    },
  });
}

export async function DELETE() {
  return Response.json(
    { message: "Session token đã bị xóa" },
    {
      status: 200,
      headers: {
        "Set-Cookie": "sessionToken=; Path=/; HttpOnly; Max-Age=0",
      },
    }
  );
}
