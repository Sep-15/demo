#!/bin/bash

# 测试通知功能的脚本

BASE_URL="http://localhost:3000/api"

echo "开始测试通知功能..."

# 清除之前的测试数据
echo "清理之前的数据..."
curl -X DELETE "$BASE_URL/chats/999999999" -H "Authorization: Bearer dummy_token" 2>/dev/null || true

# 注册第一个用户
echo "注册用户1..."
response1=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"test1@example.com","password":"password123","name":"Test User 1"}')

token1=$(echo $response1 | jq -r '.data.token')
user1_id=$(echo $response1 | jq -r '.data.user.id')

if [ "$token1" != "null" ]; then
    echo "用户1注册成功，ID: $user1_id"
else
    echo "用户1注册失败"
    echo $response1
    exit 1
fi

# 注册第二个用户
echo "注册用户2..."
response2=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"test2@example.com","password":"password123","name":"Test User 2"}')

token2=$(echo $response2 | jq -r '.data.token')
user2_id=$(echo $response2 | jq -r '.data.user.id')

if [ "$token2" != "null" ]; then
    echo "用户2注册成功，ID: $user2_id"
else
    echo "用户2注册失败"
    echo $response2
    exit 1
fi

# 用户2关注用户1，应该生成关注通知
echo "用户2关注用户1..."
follow_response=$(curl -s -X POST "$BASE_URL/follows/$user1_id" \
  -H "Authorization: Bearer $token2" \
  -H "Content-Type: application/json")

if [ "$follow_response" == "" ] || [ "$(echo $follow_response | jq -r 'if type=="object" then .followed else false end')" == "true" ]; then
    echo "关注操作成功"
else
    echo "关注操作失败"
    echo $follow_response
fi

# 等待通知生成
sleep 1

# 用户1检查通知（应该有一个关注通知）
echo "用户1检查通知..."
notifications=$(curl -s -X GET "$BASE_URL/notifications" \
  -H "Authorization: Bearer $token1")

notification_count=$(echo $notifications | jq -r 'length')
echo "用户1收到的通知数量: $notification_count"

if [ $notification_count -gt 0 ]; then
    echo "用户1的通知详情:"
    echo $notifications | jq '.'
    
    # 检查是否包含关注类型的通知
    follow_notification_exists=$(echo $notifications | jq -r '.[] | select(.type == "FOLLOW") | length' | wc -l)
    if [ $follow_notification_exists -gt 0 ]; then
        echo "✓ 成功接收到关注通知"
    else
        echo "✗ 未找到关注类型的通知"
    fi
else
    echo "✗ 用户1没有收到任何通知"
fi

# 用户1创建一个帖子
echo "用户1创建帖子..."
post_response=$(curl -s -X POST "$BASE_URL/posts" \
  -H "Authorization: Bearer $token1" \
  -H "Content-Type: application/json" \
  -d '{"content":"这是用户1发布的帖子"}')

post_id=$(echo $post_response | jq -r '.id')
if [ "$post_id" != "null" ]; then
    echo "帖子创建成功，ID: $post_id"
else
    echo "帖子创建失败"
    echo $post_response
    exit 1
fi

# 用户2给用户1的帖子点赞，应该生成点赞通知
echo "用户2给用户1的帖子点赞..."
vote_response=$(curl -s -X POST "$BASE_URL/votes" \
  -H "Authorization: Bearer $token2" \
  -H "Content-Type: application/json" \
  -d "{\"postId\":$post_id,\"voteType\":\"UP\"}")

if [ "$(echo $vote_response | jq -r 'if type=="object" then .voted else false end')" == "true" ]; then
    echo "点赞操作成功"
else
    echo "点赞操作失败"
    echo $vote_response
fi

# 等待通知生成
sleep 1

# 用户1再次检查通知（应该有新的点赞通知）
echo "用户1再次检查通知..."
notifications=$(curl -s -X GET "$BASE_URL/notifications" \
  -H "Authorization: Bearer $token1")

notification_count=$(echo $notifications | jq -r 'length')
echo "用户1当前的通知数量: $notification_count"

if [ $notification_count -gt 0 ]; then
    echo "用户1的通知详情:"
    echo $notifications | jq '.'
    
    # 检查是否包含点赞类型的通知
    like_notification_exists=$(echo $notifications | jq -r '.[] | select(.type == "LIKE") | length' | wc -l)
    if [ $like_notification_exists -gt 0 ]; then
        echo "✓ 成功接收到点赞通知"
    else
        echo "✗ 未找到点赞类型的通知"
    fi
else
    echo "✗ 用户1没有收到任何通知"
fi

# 用户2评论用户1的帖子，应该生成评论通知
echo "用户2评论用户1的帖子..."
comment_response=$(curl -s -X POST "$BASE_URL/comments" \
  -H "Authorization: Bearer $token2" \
  -H "Content-Type: application/json" \
  -d "{\"content\":\"这是用户2的评论\",\"postId\":$post_id}")

comment_id=$(echo $comment_response | jq -r '.id')
if [ "$comment_id" != "null" ]; then
    echo "评论创建成功，ID: $comment_id"
else
    echo "评论创建失败"
    echo $comment_response
fi

# 等待通知生成
sleep 1

# 用户1再次检查通知（应该有新的评论通知）
echo "用户1再次检查通知..."
notifications=$(curl -s -X GET "$BASE_URL/notifications" \
  -H "Authorization: Bearer $token1")

notification_count=$(echo $notifications | jq -r 'length')
echo "用户1当前的通知数量: $notification_count"

if [ $notification_count -gt 0 ]; then
    echo "用户1的通知详情:"
    echo $notifications | jq '.'
    
    # 检查是否包含评论类型的通知
    comment_notification_exists=$(echo $notifications | jq -r '.[] | select(.type == "COMMENT") | length' | wc -l)
    if [ $comment_notification_exists -gt 0 ]; then
        echo "✓ 成功接收到评论通知"
    else
        echo "✗ 未找到评论类型的通知"
    fi
else
    echo "✗ 用户1没有收到任何通知"
fi

# 检查未读通知计数
echo "检查用户1的未读通知数..."
unread_count=$(curl -s -X GET "$BASE_URL/notifications/unread-count" \
  -H "Authorization: Bearer $token1")

count_value=$(echo $unread_count | jq -r '.count')
echo "用户1的未读通知数: $count_value"

# 将所有通知标记为已读
echo "将用户1的所有通知标记为已读..."
read_all_response=$(curl -s -X PATCH "$BASE_URL/notifications/read-all" \
  -H "Authorization: Bearer $token1")

if [ "$read_all_response" == "" ]; then
    echo "所有通知已标记为已读"
else
    echo "标记已读操作可能失败"
    echo $read_all_response
fi

# 再次检查未读通知计数，应该是0
echo "再次检查用户1的未读通知数（应该为0）..."
unread_count=$(curl -s -X GET "$BASE_URL/notifications/unread-count" \
  -H "Authorization: Bearer $token1")

count_value=$(echo $unread_count | jq -r '.count')
echo "用户1的未读通知数: $count_value"

echo "通知功能测试完成！"