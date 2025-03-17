export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full bg-red-700 text-white text-center py-4">
      <div className="container mx-auto">
        <p>© {currentYear} Dalouaa - Bijouterie</p>
      </div>
    </footer>
  );
}