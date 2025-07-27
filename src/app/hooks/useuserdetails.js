
const useuserdetails=async()=>{

    const response=await fetch('/api/user/get-user-details', {
        method: 'GET',
        credentials: 'include',
    });
    if (!response.ok) {
        console.log('Failed to fetch user details');
    }
    const data = await response.json();
    return data.user; // Assuming the API returns user details in this format

}
export default useuserdetails;