export default async function page({
  params,
}: {
  params: Promise<{ cate_slug: string }>;
}) {
  const { cate_slug } = await params;
  return <div className="mt-30">Sản phẩm theo danh mục {cate_slug}</div>;
}
