"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import "./MovieStyle.css"; // 스타일 import

export default function MovieCard({ movie }) {
  const router = useRouter();
  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "/no-image.png";

  return (
    <div
      className="movie-card"
      onClick={() => router.push(`/movieInfo/${movie.id}`)}
    >
      <div className="movie-image">
        <Image
          src={imageUrl}
          alt={movie.title}
          fill
          className="object-cover"
          sizes="100%"
        />
      </div>
      <h3 className="movie-title">{movie.title}</h3>
      <p className="movie-rating">⭐ {movie.vote_average.toFixed(1)}</p>
    </div>
  );
};