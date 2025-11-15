interface GradientSectionProps {
  title: string;
  children: React.ReactNode;
  gradientFrom: string;
  gradientTo: string;
  borderColor: string;
}

const GradientSection = ({ 
  title, 
  children, 
  gradientFrom, 
  gradientTo, 
  borderColor 
}: GradientSectionProps) => (
  <div className={`bg-gradient-to-r ${gradientFrom} ${gradientTo} p-4 rounded-lg border ${borderColor}`}>
    <div className="flex items-center space-x-4">
      <span className="font-medium text-gray-700">{title}</span>
      {children}
    </div>
  </div>
);

export default GradientSection;