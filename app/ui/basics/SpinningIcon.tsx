// components/SpinningIcon.tsx
import { FaSpinner } from 'react-icons/fa'; // Import any icon, here we use FontAwesome's spinner

type SpinnerProps = React.ComponentProps<typeof FaSpinner> & {
	size?: number;  // You can add custom props
	className?: string;
	customColor?: string;
 };

export default function SpinningIcon ( { size=30, className, ...rest }: SpinnerProps ) {
   if ( !className ) className = '';

   return (
    <div className="spin" >
      <FaSpinner size={size} className={className} />
      <style jsx>{`
        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};