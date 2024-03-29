<?php

namespace App\Events;

use App\Models\Comment;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CreateCommentsEven implements ShouldBroadcast
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    public $comment;
    public $method;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(Comment $comment, $method)
    {
        $this->comment = $comment;
        $this->method = $method;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new Channel('comments.'.$this->comment->article_id);
    }

    public function broadcastAs()
    {
        return 'CreateCommentsEven';
    }

    public function broadcastWith()
    {
        return [
            'method' => $this->method,
            'comment'=> $this->comment,
            'author' => $this->comment->author,
        ];
    }
}
