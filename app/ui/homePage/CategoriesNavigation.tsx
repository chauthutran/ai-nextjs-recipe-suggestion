import { useRouter } from 'next/router';
import Link from 'next/link';
import { useApp } from '@/contexts/AppContext';
import SpinningIcon from '../basics/SpinningIcon';


export default function CategoriesNavigation() { 

    const { categories } = useApp();
    
  if( categories === null ) return (<div>Loading ...</div>);

     //   ${
                //     activeCategory === category.name
                //       ? 'bg-blue-500 text-white'
                //       : 'bg-white text-gray-800 hover:bg-blue-100'
                //   }
                // 
  return (
    <div className="p-6 mb-10 w-screen">
    <ul className="flex space-x-6 overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-indigo-500">
      {categories.map((category) => (
        <li key={category._id}>
          <a
            className={`group flex items-center space-x-3 px-6 py-3 bg-white hover:bg-indigo-600 text-gray-700 hover:text-white rounded-md transition-all transform cursor-pointer`}
          >
            <svg
              className="h-6 w-6 text-indigo-500 group-hover:text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"
              />
            </svg>
            <span className="font-semibold text-sm group-hover:text-white">{category.name}</span>
          </a>
        </li>
      ))}
    </ul>
  </div>
  
  );
};