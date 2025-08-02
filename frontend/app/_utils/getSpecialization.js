
// get all specializations from backend
export const fetchSpecializations = async() => {
    try{
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/patient/specializations`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            mode: 'cors'
        });
    
        if (!response.ok) {
            throw new Error('Failed to fetch specializations');
        }
        const data = await response.json();
        // console.log("data :",data)
        return data;

    }catch (error) {
        console.error('Error fetching specializations:', error);
        throw new Error('Network error while fetching specializations');
    }

};