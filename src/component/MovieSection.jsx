"use client";
import MovieCard from "./MovieCard";
import "./MovieStyle.css"; // 스타일 import

export default function MovieSection({ title, movies }) {
  return (
    <section className="movie-section">
      <h2 className="section-title">{title}</h2>
      <div className="movie-grid">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
}
