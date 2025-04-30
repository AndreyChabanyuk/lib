"use client"


const ExhibitionDetail = ({params}: {
    params: {slug: string}
}) => {
    
    /* const { slug } = router.query; */
   
    return (
        <div>
            <h1>Детали выставки:{params.slug}</h1>
       
        </div>
    );
}

export default ExhibitionDetail;