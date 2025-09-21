import EditRecipeComp from '@/components/EditRecipeComp'
import Layout from '@/components/Layout'
import React from 'react'

const EditRecipePage = async ({ params }) => {
    const { id } = await params; // get recipe ID from URL

    return (
        <Layout>
            <EditRecipeComp recipeId={id} />
        </Layout>
    )
}

export default EditRecipePage;
