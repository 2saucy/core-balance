import Link from "next/link";

interface TipCardProps {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
}
const TipCard: React.FC<TipCardProps> = ({ id, title, description, imageUrl }) => {
    return (
        <Link href={`/tips/${id}`}>
            <div>
                <img src={imageUrl} alt={title} className="w-full h-48 object-cover rounded-lg" />
                <h3 className="text-lg font-semibold mt-2">{title}</h3>
                <p className="text-sm text-gray-600 mt-1">{description}</p>
            </div>
        </Link>
    );
};

export default TipCard;