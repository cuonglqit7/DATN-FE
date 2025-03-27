export default async function page({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  return <div className="mt-30 ">Đơn hàng {code}</div>;
}
