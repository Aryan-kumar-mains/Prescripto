
// get featured doctors from backend
export const fetchFeaturedDoctors = async() => {
    try{
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/patient/featured-doctors`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            mode: 'cors'
        });

        if (!response.ok) {
            throw new Error('Failed to fetch featured doctors');
        }
        const data = await response.json();
        // console.log("data :",data)
        return data;
    }catch (error) {
        console.error('Error fetching featured doctors:', error);
        throw new Error('Network error while fetching featured doctors');
    }
}