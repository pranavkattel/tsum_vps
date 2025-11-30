export default function SimpleTest() {
  return (
    <div className="min-h-screen bg-blue-500 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Test Component</h1>
        <p className="text-gray-600">If you can see this, React and Tailwind are working properly!</p>
        <div className="mt-4 p-4 bg-green-100 rounded">
          <p className="text-green-800">✅ React is rendering</p>
          <p className="text-green-800">✅ Tailwind styles are loading</p>
          <p className="text-green-800">✅ Components are working</p>
        </div>
      </div>
    </div>
  );
}
