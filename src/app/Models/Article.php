<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    use HasFactory;
    protected $primaryKey = 'article_id';

    /**
     * Вернет модель со всеми связями.
     *
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function getWithConnections()
    {
        return $this->
            with([
                'category'=> function ($query) {
                    $query->select(['category_id', 'name']);
                },
                'author'=> function ($query) {
                    $query->select(['user_id', 'name', 'dec', 'avatar']);
                },
                'rating'=> function ($query) {
                    $query->select(['rating_id', 'rating', 'NumberOfVotes']);
                },
            ]);
    }

    protected $tags = [
        'tags' => 'json',
    ];

    public function category()
    {
        return $this->hasOne(Category::class, 'category_id', 'category_id');
    }

    public function author()
    {
        return $this->hasOne(User::class, 'user_id', 'author_id');
    }

    public function rating()
    {
        return $this->hasOne(Rating::class, 'rating_id', 'rating_id');
    }
}
