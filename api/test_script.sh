#!/bin/bash

# Social Network API 测试脚本

# API基础URL
BASE_URL="http://localhost:3000/api"

# 存储用户token的数组
declare -a USER_TOKENS=()
declare -a USER_IDS=()

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 打印带颜色的信息
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# 检查API是否运行
check_api_health() {
    print_info "检查API健康状态..."
    response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/health")
    if [ $response -eq 200 ]; then
        print_info "API运行正常"
        return 0
    else
        print_error "API未运行或无法访问"
        exit 1
    fi
}

# 注册用户
register_user() {
    local index=$1
    local email="user$index@example.com"
    local name="User$index"
    local password="password123"
    
    print_info "注册用户 $name ($email)..."
    
    response=$(curl -s -X POST "$BASE_URL/auth/register" \
        -H "Content-Type: application/json" \
        -d "{\"email\":\"$email\",\"name\":\"$name\",\"password\":\"$password\"}")
    
    token=$(echo $response | jq -r '.data.token')
    user_id=$(echo $response | jq -r '.data.user.id')
    
    if [ "$token" != "null" ] && [ "$user_id" != "null" ]; then
        USER_TOKENS[$index]=$token
        USER_IDS[$index]=$user_id
        print_info "用户 $name 注册成功 (ID: $user_id)"
        return 0
    else
        print_error "用户 $name 注册失败: $response"
        return 1
    fi
}

# 创建多个用户
create_users() {
    print_info "开始创建10个测试用户..."
    
    for i in {1..10}; do
        if ! register_user $i; then
            print_error "注册第 $i 个用户失败"
            return 1
        fi
    done
    
    print_info "成功创建10个用户"
}

# 用户登录
login_user() {
    local index=$1
    local email="user$index@example.com"
    local password="password123"
    
    print_info "登录用户 $email..."
    
    response=$(curl -s -X POST "$BASE_URL/auth/login" \
        -H "Content-Type: application/json" \
        -d "{\"email\":\"$email\",\"password\":\"$password\"}")
    
    token=$(echo $response | jq -r '.data.token')
    user_id=$(echo $response | jq -r '.data.user.id')
    
    if [ "$token" != "null" ] && [ "$user_id" != "null" ]; then
        USER_TOKENS[$index]=$token
        USER_IDS[$index]=$user_id
        print_info "用户 $email 登录成功"
        return 0
    else
        print_error "用户 $email 登录失败: $response"
        return 1
    fi
}

# 发布帖子
create_post() {
    local user_index=$1
    local content=$2
    
    local token=${USER_TOKENS[$user_index]}
    local headers=(-H "Authorization: Bearer $token" -H "Content-Type: application/json")
    
    print_info "用户 $user_index 发布帖子: ${content:0:30}..."
    
    response=$(curl -s -X POST "$BASE_URL/posts" \
        "${headers[@]}" \
        -d "{\"content\":\"$content\"}")
    
    post_id=$(echo $response | jq -r '.data.id')
    
    if [ "$post_id" != "null" ]; then
        print_info "帖子发布成功 (ID: $post_id)"
        return 0
    else
        print_error "帖子发布失败: $response"
        return 1
    fi
}

# 让用户发布多篇帖子
create_posts_for_user() {
    local user_index=$1
    local num_posts=$2
    
    print_info "用户 $user_index 开始发布 $num_posts 篇帖子..."
    
    for i in $(seq 1 $num_posts); do
        content="这是用户 $user_index 的第 $i 篇帖子，内容为：$(date)"
        if ! create_post $user_index "$content"; then
            print_error "用户 $user_index 第 $i 篇帖子发布失败"
        fi
    done
    
    print_info "用户 $user_index 完成 $num_posts 篇帖子发布"
}

# 关注其他用户
follow_user() {
    local follower_index=$1
    local following_index=$2
    
    local token=${USER_TOKENS[$follower_index]}
    local headers=(-H "Authorization: Bearer $token" -H "Content-Type: application/json")
    
    print_info "用户 $follower_index 关注用户 $following_index..."
    
    response=$(curl -s -X POST "$BASE_URL/follows/${USER_IDS[$following_index]}" \
        "${headers[@]}")
    
    if [ $? -eq 0 ]; then
        print_info "用户 $follower_index 成功关注用户 $following_index"
        return 0
    else
        print_error "用户 $follower_index 关注用户 $following_index 失败: $response"
        return 1
    fi
}

# 让用户相互关注
mutual_follow() {
    print_info "开始设置用户相互关注..."
    
    # 每个用户关注其他所有用户
    for ((i=1; i<=10; i++)); do
        for ((j=1; j<=10; j++)); do
            if [ $i -ne $j ]; then
                follow_user $i $j
            fi
        done
    done
    
    print_info "完成用户相互关注设置"
}

# 发送私信
send_chat_message() {
    local sender_index=$1
    local receiver_index=$2
    local content=$3
    
    local token=${USER_TOKENS[$sender_index]}
    local headers=(-H "Authorization: Bearer $token" -H "Content-Type: application/json")
    
    print_info "用户 $sender_index 向用户 $receiver_index 发送消息: ${content:0:20}..."
    
    response=$(curl -s -X POST "$BASE_URL/chats" \
        "${headers[@]}" \
        -d "{\"receiverId\":${USER_IDS[$receiver_index]},\"content\":\"$content\"}")
    
    message_id=$(echo $response | jq -r '.data.id')
    
    if [ "$message_id" != "null" ]; then
        print_info "消息发送成功 (ID: $message_id)"
        return 0
    else
        print_error "消息发送失败: $response"
        return 1
    fi
}

# 用户间互相聊天
mutual_chat() {
    print_info "开始用户间互相聊天..."
    
    # 每对用户互相发送一条消息
    for ((i=1; i<=5; i++)); do
        for ((j=i+1; j<=10; j++)); do
            content="你好，我是用户 $i，很高兴认识你！"
            send_chat_message $i $j "$content"
            
            content="你好，我是用户 $j，也很高兴认识你！"
            send_chat_message $j $i "$content"
        done
    done
    
    print_info "完成用户间聊天"
}

# 创建群组
create_group() {
    local creator_index=$1
    local group_name=$2
    
    local token=${USER_TOKENS[$creator_index]}
    local headers=(-H "Authorization: Bearer $token" -H "Content-Type: application/json")
    
    print_info "用户 $creator_index 创建群组: $group_name"
    
    response=$(curl -s -X POST "$BASE_URL/groups" \
        "${headers[@]}" \
        -d "{\"name\":\"$group_name\"}")
    
    group_id=$(echo $response | jq -r '.data.id')
    
    if [ "$group_id" != "null" ]; then
        print_info "群组创建成功 (ID: $group_id)"
        echo $group_id
        return 0
    else
        print_error "群组创建失败: $response"
        return 1
    fi
}

# 加入群组
join_group() {
    local user_index=$1
    local group_id=$2
    
    local token=${USER_TOKENS[$user_index]}
    local headers=(-H "Authorization: Bearer $token" -H "Content-Type: application/json")
    
    print_info "用户 $user_index 加入群组 $group_id"
    
    response=$(curl -s -X POST "$BASE_URL/groups/$group_id/join" \
        "${headers[@]}")
    
    if [ $? -eq 0 ]; then
        print_info "用户 $user_index 成功加入群组 $group_id"
        return 0
    else
        print_error "用户 $user_index 加入群组 $group_id 失败: $response"
        return 1
    fi
}

# 在群组中发送消息
send_group_message() {
    local sender_index=$1
    local group_id=$2
    local content=$3
    
    local token=${USER_TOKENS[$sender_index]}
    local headers=(-H "Authorization: Bearer $token" -H "Content-Type: application/json")
    
    print_info "用户 $sender_index 在群组 $group_id 发送消息: ${content:0:20}..."
    
    response=$(curl -s -X POST "$BASE_URL/groups/$group_id/messages" \
        "${headers[@]}" \
        -d "{\"content\":\"$content\"}")
    
    message_id=$(echo $response | jq -r '.data.id')
    
    if [ "$message_id" != "null" ]; then
        print_info "群消息发送成功 (ID: $message_id)"
        return 0
    else
        print_error "群消息发送失败: $response"
        return 1
    fi
}

# 创建群聊并发送消息
create_groups_and_messages() {
    print_info "开始创建群组并发送消息..."
    
    # 创建一个群组
    group_name="Test Group 1"
    group_id=$(create_group 1 "$group_name")
    
    if [ -z "$group_id" ] || [ "$group_id" = "null" ]; then
        print_error "无法创建群组，跳过群组测试"
        return 1
    fi
    
    # 让前5个用户加入群组
    for i in {2..5}; do
        join_group $i $group_id
    done
    
    # 在群组中发送一些消息
    for i in {1..5}; do
        content="群消息 $i from 用户 $(( (i % 5) + 1 ))"
        send_group_message $(( (i % 5) + 1 )) $group_id "$content"
    done
    
    print_info "完成群组创建和消息发送"
}

# 主函数
main() {
    print_info "开始Social Network API测试"
    
    # 检查API健康状态
    check_api_health
    
    # 创建10个用户
    if ! create_users; then
        print_error "创建用户失败"
        exit 1
    fi
    
    # 让每个用户发布10个帖子
    for i in {1..10}; do
        create_posts_for_user $i 10
    done
    
    # 设置用户相互关注
    mutual_follow
    
    # 用户间互相聊天
    mutual_chat
    
    # 创建群组并发送消息
    create_groups_and_messages
    
    print_info "所有测试完成！"
}

# 运行主函数
main