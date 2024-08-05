import Header from '@/components/shared/Header'
import TransformationForm from '@/components/shared/TransformationForm';
import { transformationTypes } from '@/constants'
import { getUserById } from '@/lib/actions/user.actions';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

const AddTransformationTypePage = async ({ params: { type } }: SearchParamProps) => {
  // getting userId from the middleware function
  const { userId } = auth();
  //  restore: {
   // type: "restore",
   // title: "Restore Image",
   // subTitle: "Refine images by removing noise and imperfections",
   // config: { restore: true },
   // icon: "image.svg",
 //// },
  //
  const transformation = transformationTypes[type];

  if(!userId) redirect('/sign-in')

  const user = await getUserById(userId);

  return (
    <>
      <Header 
      
        title={transformation.title}
        subtitle={transformation.subTitle}
      />
    
      <section className="mt-10">
        <TransformationForm 
          action="Add"
          userId={user._id}
          type={transformation.type as TransformationTypeKey}
          creditBalance={user.creditBalance}
        />
      </section>
    </>
  )
}

export default AddTransformationTypePage