import { useState } from 'react';

function StableImg() {
  const [inputValue, setInputValue] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const response = await fetch('/api/stablediffusion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ value: inputValue }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data);
      setImageUrl(data[0]);
    } else {
      console.error('Error:', response.statusText);
    }
    setLoading(false);
  };

  return (
    <div >
      <div>
        <div></div>
        <div>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            //   className="w-full px-5 py-3 text-gray-700 bg-gray-200 rounded"
              placeholder="Enter a prompt..."
            />
            <button type="submit" 
            // className="w-full px-3 py-4 text-white bg-gradient-to-r from-cyan-400 via-green-500 to-cyan-400 rounded-md focus:outline-none" 
            disabled={loading}>
              Submit
            </button>
          </form>
        </div>
      </div>
      {loading && (
        <div 
        // className="mt-12 flex justify-center"
        >
          <div 
        //   className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"
          ></div>
        </div>
      )}
      {imageUrl && !loading && (
        <div className="mt-12 flex justify-center">
          <img src={imageUrl} alt="Generated image" 
        //   className="rounded-xl shadow-lg"
           />
        </div>
      )}
     
    </div>
  );
}

export default StableImg;