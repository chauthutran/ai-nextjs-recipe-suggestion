export default function Footer() {
    return (
        <footer className="bg-leaf-green text-white shadow-md p-1 pt-2 text-sm">
            <div className="flex flex-col justify-between items-center space-y-1">
                <p className="flex-1 justify-center">© 2024 AI Recipes. All rights reserved.</p>
                <div className="flex space-x-3">
                   <div className="hover:text-color-7 cursor-pointer">Team And Privacy Policy</div>
                    <div> | </div>
                    <div className="hover:text-color-7 cursor-pointer">About Us</div>
                </div>
            </div>
        </footer>
    )
}