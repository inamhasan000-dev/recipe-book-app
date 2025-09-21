// app/recipe/[id]/page.js
import Layout from '@/components/Layout';
import { formatTimestamp } from '@/lib/commonHelper';
import { getDataId } from '@/lib/firebaseAction';
import Link from 'next/link';

export default async function RecipeDetailPage({ params }) {
    const { id } = await params;

    // Fetch recipe on the server
    const recipe = await getDataId('recipeList', id);

    if (!recipe) {
        return (
            <Layout>
                <div className="text-center mt-12">Recipe not found</div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-12 mb-12">
                <span className='flex justify-between'>
                    <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">{recipe.title}
                        {/* Edit */}

                        <Link href={`/edit/${id}`}><img src="/pencil.svg" alt="Delete" className="w-5 h-5" /></Link>
                    </h1>

                </span>
                {recipe.image && (
                    <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="w-full max-h-[280px] object-cover rounded mb-4"
                    />
                )}

                {recipe.description && <p className="mb-4 text-gray-700">{recipe.description}</p>}

                <div
                    className="border rounded p-4 min-h-[200px] bg-gray-50 prose"
                    dangerouslySetInnerHTML={{ __html: recipe.instructions || '<p>No instructions available</p>' }}
                />
                <p className='text-sm text-left mt-4'>
                    {recipe?.created_at && <>Posted: {formatTimestamp(recipe?.created_at)}<br /></>}
                    {recipe?.updated_on && <>Updated: {formatTimestamp(recipe?.updated_on)}</>}
                </p>
            </div>
        </Layout>
    );
}
