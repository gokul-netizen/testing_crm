import { prisma } from "@/lib/prisma";
import EditDomainForm from "./formData";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditPage({ params }: Props) {
  const { id } = await params;
  const domain = await prisma.inquiryDomain.findUnique({
    where: { id: Number(id) },
  });

  if (!domain) {
    return <p>Domain not found</p>;
  }
   

  return (
    <section className="p-4">
      <EditDomainForm domain={domain} />
    </section>
  );
}



