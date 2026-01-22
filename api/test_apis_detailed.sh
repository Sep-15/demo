#!/bin/bash

# 详细API测试脚本
BASE_URL="http://localhost:3000"

echo "开始详细测试API端点..."

# 记录错误的数组
errors=()

# 准备测试用户数据
TEST_USER_EMAIL="testuser$(date +%s)@example.com"
TEST_USERNAME="testuser$(date +%s)"
TEST_PASSWORD="password123"

# 注册新用户
echo "测试: POST /api/auth/register"
payload="{\"email\":\"$TEST_USER_EMAIL\",\"username\":\"$TEST_USERNAME\",\"password\":\"$TEST_PASSWORD\"}"
response=$(curl -s -o response_body.txt -w "%{http_code}" -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "$payload")
http_code=$response
echo "状态码: $http_code"
if [ "$http_code" != "200" ] && [ "$http_code" != "201" ]; then
    echo "错误: POST /api/auth/register 返回状态码 $http_code"
    echo "响应体: $(cat response_body.txt)"
    errors+=("POST /api/auth/register - 状态码: $http_code, 响应: $(cat response_body.txt)")
    # 如果注册失败，我们无法继续测试需要认证的端点
    echo "由于注册失败，退出测试"
    rm -f response_body.txt
    exit 1
else
    echo "成功: POST /api/auth/register"
    # 提取token用于后续请求
    TOKEN=$(grep -o '"token":"[^"]*"' response_body.txt | cut -d'"' -f4)
fi
echo ""

# 登录用户
if [ -n "$TOKEN" ]; then
    echo "测试: POST /api/auth/login"
    payload="{\"email\":\"$TEST_USER_EMAIL\",\"password\":\"$TEST_PASSWORD\"}"
    response=$(curl -s -o response_body.txt -w "%{http_code}" -X POST "$BASE_URL/api/auth/login" \
      -H "Content-Type: application/json" \
      -d "$payload")
    http_code=$response
    echo "状态码: $http_code"
    if [ "$http_code" != "200" ]; then
        echo "错误: POST /api/auth/login 返回状态码 $http_code"
        echo "响应体: $(cat response_body.txt)"
        errors+=("POST /api/auth/login - 状态码: $http_code, 响应: $(cat response_body.txt)")
        TOKEN=""  # 清除无效token
    else
        echo "成功: POST /api/auth/login"
        # 更新token（如果登录返回新的token）
        NEW_TOKEN=$(grep -o '"token":"[^"]*"' response_body.txt | cut -d'"' -f4)
        if [ -n "$NEW_TOKEN" ]; then
            TOKEN=$NEW_TOKEN
        fi
    fi
    echo ""
fi

# 测试获取当前用户信息
if [ -n "$TOKEN" ]; then
    echo "测试: GET /api/auth/me"
    response=$(curl -s -o response_body.txt -w "%{http_code}" -X GET "$BASE_URL/api/auth/me" \
      -H "Authorization: Bearer $TOKEN")
    http_code=$response
    echo "状态码: $http_code"
    if [ "$http_code" != "200" ]; then
        echo "错误: GET /api/auth/me 返回状态码 $http_code"
        echo "响应体: $(cat response_body.txt)"
        errors+=("GET /api/auth/me - 状态码: $http_code, 响应: $(cat response_body.txt)")
    else
        echo "成功: GET /api/auth/me"
        USER_ID=$(grep -o '"id":"[^"]*"' response_body.txt | cut -d'"' -f4)
    fi
    echo ""
fi

# 测试用户资料相关API
if [ -n "$TOKEN" ] && [ -n "$USER_ID" ]; then
    echo "测试: GET /api/users/$USER_ID"
    response=$(curl -s -o response_body.txt -w "%{http_code}" -X GET "$BASE_URL/api/users/$USER_ID" \
      -H "Authorization: Bearer $TOKEN")
    http_code=$response
    echo "状态码: $http_code"
    if [ "$http_code" != "200" ]; then
        echo "错误: GET /api/users/$USER_ID 返回状态码 $http_code"
        echo "响应体: $(cat response_body.txt)"
        errors+=("GET /api/users/$USER_ID - 状态码: $http_code, 响应: $(cat response_body.txt)")
    else
        echo "成功: GET /api/users/$USER_ID"
    fi
    echo ""
    
    # 测试更新用户资料
    echo "测试: PATCH /api/users/me"
    payload="{\"bio\":\"Updated bio via API test\"}"
    response=$(curl -s -o response_body.txt -w "%{http_code}" -X PATCH "$BASE_URL/api/users/me" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $TOKEN" \
      -d "$payload")
    http_code=$response
    echo "状态码: $http_code"
    if [ "$http_code" != "200" ]; then
        echo "错误: PATCH /api/users/me 返回状态码 $http_code"
        echo "响应体: $(cat response_body.txt)"
        errors+=("PATCH /api/users/me - 状态码: $http_code, 响应: $(cat response_body.txt)")
    else
        echo "成功: PATCH /api/users/me"
    fi
    echo ""
    
    # 测试删除用户（谨慎操作，可能影响后续测试）
    # echo "测试: DELETE /api/users/me"
    # response=$(curl -s -o response_body.txt -w "%{http_code}" -X DELETE "$BASE_URL/api/users/me" \
    #   -H "Authorization: Bearer $TOKEN")
    # http_code=$response
    # echo "状态码: $http_code"
    # if [ "$http_code" != "200" ]; then
    #     echo "错误: DELETE /api/users/me 返回状态码 $http_code"
    #     echo "响应体: $(cat response_body.txt)"
    #     errors+=("DELETE /api/users/me - 状态码: $http_code, 响应: $(cat response_body.txt)")
    # else
    #     echo "成功: DELETE /api/users/me"
    # fi
    # echo ""
    
    # 测试获取用户帖子
    echo "测试: GET /api/users/$USER_ID/posts"
    response=$(curl -s -o response_body.txt -w "%{http_code}" -X GET "$BASE_URL/api/users/$USER_ID/posts" \
      -H "Authorization: Bearer $TOKEN")
    http_code=$response
    echo "状态码: $http_code"
    if [ "$http_code" != "200" ]; then
        echo "错误: GET /api/users/$USER_ID/posts 返回状态码 $http_code"
        echo "响应体: $(cat response_body.txt)"
        errors+=("GET /api/users/$USER_ID/posts - 状态码: $http_code, 响应: $(cat response_body.txt)")
    else
        echo "成功: GET /api/users/$USER_ID/posts"
    fi
    echo ""
fi

# 测试帖子相关API
if [ -n "$TOKEN" ]; then
    echo "测试: GET /api/posts"
    response=$(curl -s -o response_body.txt -w "%{http_code}" -X GET "$BASE_URL/api/posts" \
      -H "Authorization: Bearer $TOKEN")
    http_code=$response
    echo "状态码: $http_code"
    if [ "$http_code" != "200" ]; then
        echo "错误: GET /api/posts 返回状态码 $http_code"
        echo "响应体: $(cat response_body.txt)"
        errors+=("GET /api/posts - 状态码: $http_code, 响应: $(cat response_body.txt)")
    else
        echo "成功: GET /api/posts"
    fi
    echo ""
    
    # 创建一个帖子用于后续测试
    echo "测试: POST /api/posts"
    payload="{\"title\":\"Test Post\",\"content\":\"This is a test post created during API testing\"}"
    response=$(curl -s -o response_body.txt -w "%{http_code}" -X POST "$BASE_URL/api/posts" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $TOKEN" \
      -d "$payload")
    http_code=$response
    POST_ID=""
    if [ "$http_code" = "200" ] || [ "$http_code" = "201" ]; then
        echo "成功: POST /api/posts"
        POST_ID=$(grep -o '"id":"[^"]*"' response_body.txt | cut -d'"' -f4)
    else
        echo "错误: POST /api/posts 返回状态码 $http_code"
        echo "响应体: $(cat response_body.txt)"
        errors+=("POST /api/posts - 状态码: $http_code, 响应: $(cat response_body.txt)")
    fi
    echo ""
    
    # 如果帖子创建成功，测试获取特定帖子
    if [ -n "$POST_ID" ]; then
        echo "测试: GET /api/posts/$POST_ID"
        response=$(curl -s -o response_body.txt -w "%{http_code}" -X GET "$BASE_URL/api/posts/$POST_ID" \
          -H "Authorization: Bearer $TOKEN")
        http_code=$response
        echo "状态码: $http_code"
        if [ "$http_code" != "200" ]; then
            echo "错误: GET /api/posts/$POST_ID 返回状态码 $http_code"
            echo "响应体: $(cat response_body.txt)"
            errors+=("GET /api/posts/$POST_ID - 状态码: $http_code, 响应: $(cat response_body.txt)")
        else
            echo "成功: GET /api/posts/$POST_ID"
        fi
        echo ""
        
        # 测试更新帖子
        echo "测试: PATCH /api/posts/$POST_ID"
        payload="{\"title\":\"Updated Test Post\",\"content\":\"This is an updated test post\"}"
        response=$(curl -s -o response_body.txt -w "%{http_code}" -X PATCH "$BASE_URL/api/posts/$POST_ID" \
          -H "Content-Type: application/json" \
          -H "Authorization: Bearer $TOKEN" \
          -d "$payload")
        http_code=$response
        echo "状态码: $http_code"
        if [ "$http_code" != "200" ]; then
            echo "错误: PATCH /api/posts/$POST_ID 返回状态码 $http_code"
            echo "响应体: $(cat response_body.txt)"
            errors+=("PATCH /api/posts/$POST_ID - 状态码: $http_code, 响应: $(cat response_body.txt)")
        else
            echo "成功: PATCH /api/posts/$POST_ID"
        fi
        echo ""
        
        # 测试删除帖子
        echo "测试: DELETE /api/posts/$POST_ID"
        response=$(curl -s -o response_body.txt -w "%{http_code}" -X DELETE "$BASE_URL/api/posts/$POST_ID" \
          -H "Authorization: Bearer $TOKEN")
        http_code=$response
        echo "状态码: $http_code"
        if [ "$http_code" != "200" ]; then
            echo "错误: DELETE /api/posts/$POST_ID 返回状态码 $http_code"
            echo "响应体: $(cat response_body.txt)"
            errors+=("DELETE /api/posts/$POST_ID - 状态码: $http_code, 响应: $(cat response_body.txt)")
        else
            echo "成功: DELETE /api/posts/$POST_ID"
        fi
        echo ""
    fi
    
    # 再次创建一个帖子用于评论和投票测试
    echo "测试: POST /api/posts (for comments/votes)"
    payload="{\"title\":\"Test Post for Comments\",\"content\":\"This is a test post for comments and votes\"}"
    response=$(curl -s -o response_body.txt -w "%{http_code}" -X POST "$BASE_URL/api/posts" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $TOKEN" \
      -d "$payload")
    http_code=$response
    POST_ID_FOR_COMMENTS=""
    if [ "$http_code" = "200" ] || [ "$http_code" = "201" ]; then
        echo "成功: POST /api/posts (for comments/votes)"
        POST_ID_FOR_COMMENTS=$(grep -o '"id":"[^"]*"' response_body.txt | cut -d'"' -f4)
    else
        echo "错误: POST /api/posts (for comments/votes) 返回状态码 $http_code"
        echo "响应体: $(cat response_body.txt)"
        errors+=("POST /api/posts (for comments/votes) - 状态码: $http_code, 响应: $(cat response_body.txt)")
    fi
    echo ""
    
    # 测试获取我的帖子
    echo "测试: GET /api/posts/me"
    response=$(curl -s -o response_body.txt -w "%{http_code}" -X GET "$BASE_URL/api/posts/me" \
      -H "Authorization: Bearer $TOKEN")
    http_code=$response
    echo "状态码: $http_code"
    if [ "$http_code" != "200" ]; then
        echo "错误: GET /api/posts/me 返回状态码 $http_code"
        echo "响应体: $(cat response_body.txt)"
        errors+=("GET /api/posts/me - 状态码: $http_code, 响应: $(cat response_body.txt)")
    else
        echo "成功: GET /api/posts/me"
    fi
    echo ""
fi

# 测试关注相关API (使用虚拟用户ID，因为我们需要一个已存在的用户)
if [ -n "$TOKEN" ]; then
    # 先创建另一个用户用于关注测试
    TEST_USER2_EMAIL="testuser2$(date +%s)@example.com"
    TEST_USER2_USERNAME="testuser2$(date +%s)"
    TEST_USER2_PASSWORD="password123"
    
    echo "为关注测试创建第二个用户"
    payload="{\"email\":\"$TEST_USER2_EMAIL\",\"username\":\"$TEST_USER2_USERNAME\",\"password\":\"$TEST_USER2_PASSWORD\"}"
    response=$(curl -s -o response_body2.txt -w "%{http_code}" -X POST "$BASE_URL/api/auth/register" \
      -H "Content-Type: application/json" \
      -d "$payload")
    http_code=$response
    if [ "$http_code" = "200" ] || [ "$http_code" = "201" ]; then
        echo "成功创建第二个用户"
        USER2_ID=$(grep -o '"id":"[^"]*"' response_body2.txt | cut -d'"' -f4)
    else
        echo "创建第二个用户失败，跳过关注测试"
        USER2_ID=""
    fi
    
    if [ -n "$USER2_ID" ]; then
        echo "测试: POST /api/follows/$USER2_ID"
        response=$(curl -s -o response_body.txt -w "%{http_code}" -X POST "$BASE_URL/api/follows/$USER2_ID" \
          -H "Authorization: Bearer $TOKEN")
        http_code=$response
        echo "状态码: $http_code"
        if [ "$http_code" != "200" ]; then
            echo "错误: POST /api/follows/$USER2_ID 返回状态码 $http_code"
            echo "响应体: $(cat response_body.txt)"
            errors+=("POST /api/follows/$USER2_ID - 状态码: $http_code, 响应: $(cat response_body.txt)")
        else
            echo "成功: POST /api/follows/$USER2_ID"
        fi
        echo ""
        
        echo "测试: GET /api/follows/$USER2_ID/status"
        response=$(curl -s -o response_body.txt -w "%{http_code}" -X GET "$BASE_URL/api/follows/$USER2_ID/status" \
          -H "Authorization: Bearer $TOKEN")
        http_code=$response
        echo "状态码: $http_code"
        if [ "$http_code" != "200" ]; then
            echo "错误: GET /api/follows/$USER2_ID/status 返回状态码 $http_code"
            echo "响应体: $(cat response_body.txt)"
            errors+=("GET /api/follows/$USER2_ID/status - 状态码: $http_code, 响应: $(cat response_body.txt)")
        else
            echo "成功: GET /api/follows/$USER2_ID/status"
        fi
        echo ""
        
        echo "测试: DELETE /api/follows/$USER2_ID"
        response=$(curl -s -o response_body.txt -w "%{http_code}" -X DELETE "$BASE_URL/api/follows/$USER2_ID" \
          -H "Authorization: Bearer $TOKEN")
        http_code=$response
        echo "状态码: $http_code"
        if [ "$http_code" != "200" ]; then
            echo "错误: DELETE /api/follows/$USER2_ID 返回状态码 $http_code"
            echo "响应体: $(cat response_body.txt)"
            errors+=("DELETE /api/follows/$USER2_ID - 状态码: $http_code, 响应: $(cat response_body.txt)")
        else
            echo "成功: DELETE /api/follows/$USER2_ID"
        fi
        echo ""
    fi
    
    echo "测试: GET /api/follows/me/following"
    response=$(curl -s -o response_body.txt -w "%{http_code}" -X GET "$BASE_URL/api/follows/me/following" \
      -H "Authorization: Bearer $TOKEN")
    http_code=$response
    echo "状态码: $http_code"
    if [ "$http_code" != "200" ]; then
        echo "错误: GET /api/follows/me/following 返回状态码 $http_code"
        echo "响应体: $(cat response_body.txt)"
        errors+=("GET /api/follows/me/following - 状态码: $http_code, 响应: $(cat response_body.txt)")
    else
        echo "成功: GET /api/follows/me/following"
    fi
    echo ""
    
    echo "测试: GET /api/follows/me/followers"
    response=$(curl -s -o response_body.txt -w "%{http_code}" -X GET "$BASE_URL/api/follows/me/followers" \
      -H "Authorization: Bearer $TOKEN")
    http_code=$response
    echo "状态码: $http_code"
    if [ "$http_code" != "200" ]; then
        echo "错误: GET /api/follows/me/followers 返回状态码 $http_code"
        echo "响应体: $(cat response_body.txt)"
        errors+=("GET /api/follows/me/followers - 状态码: $http_code, 响应: $(cat response_body.txt)")
    else
        echo "成功: GET /api/follows/me/followers"
    fi
    echo ""
fi

# 测试评论相关API
if [ -n "$TOKEN" ] && [ -n "$POST_ID_FOR_COMMENTS" ]; then
    echo "测试: POST /api/comments"
    payload="{\"postId\":\"$POST_ID_FOR_COMMENTS\",\"content\":\"This is a test comment\"}"
    response=$(curl -s -o response_body.txt -w "%{http_code}" -X POST "$BASE_URL/api/comments" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $TOKEN" \
      -d "$payload")
    http_code=$response
    COMMENT_ID=""
    if [ "$http_code" = "200" ] || [ "$http_code" = "201" ]; then
        echo "成功: POST /api/comments"
        COMMENT_ID=$(grep -o '"id":"[^"]*"' response_body.txt | cut -d'"' -f4)
    else
        echo "错误: POST /api/comments 返回状态码 $http_code"
        echo "响应体: $(cat response_body.txt)"
        errors+=("POST /api/comments - 状态码: $http_code, 响应: $(cat response_body.txt)")
    fi
    echo ""
    
    # 如果评论创建成功，测试获取评论
    if [ -n "$COMMENT_ID" ]; then
        echo "测试: GET /api/comments/$COMMENT_ID"
        response=$(curl -s -o response_body.txt -w "%{http_code}" -X GET "$BASE_URL/api/comments/$COMMENT_ID" \
          -H "Authorization: Bearer $TOKEN")
        http_code=$response
        echo "状态码: $http_code"
        if [ "$http_code" != "200" ]; then
            echo "错误: GET /api/comments/$COMMENT_ID 返回状态码 $http_code"
            echo "响应体: $(cat response_body.txt)"
            errors+=("GET /api/comments/$COMMENT_ID - 状态码: $http_code, 响应: $(cat response_body.txt)")
        else
            echo "成功: GET /api/comments/$COMMENT_ID"
        fi
        echo ""
        
        # 测试更新评论
        echo "测试: PATCH /api/comments/$COMMENT_ID"
        payload="{\"content\":\"This is an updated test comment\"}"
        response=$(curl -s -o response_body.txt -w "%{http_code}" -X PATCH "$BASE_URL/api/comments/$COMMENT_ID" \
          -H "Content-Type: application/json" \
          -H "Authorization: Bearer $TOKEN" \
          -d "$payload")
        http_code=$response
        echo "状态码: $http_code"
        if [ "$http_code" != "200" ]; then
            echo "错误: PATCH /api/comments/$COMMENT_ID 返回状态码 $http_code"
            echo "响应体: $(cat response_body.txt)"
            errors+=("PATCH /api/comments/$COMMENT_ID - 状态码: $http_code, 响应: $(cat response_body.txt)")
        else
            echo "成功: PATCH /api/comments/$COMMENT_ID"
        fi
        echo ""
        
        # 测试获取回复
        echo "测试: GET /api/comments/$COMMENT_ID/replies"
        response=$(curl -s -o response_body.txt -w "%{http_code}" -X GET "$BASE_URL/api/comments/$COMMENT_ID/replies" \
          -H "Authorization: Bearer $TOKEN")
        http_code=$response
        echo "状态码: $http_code"
        if [ "$http_code" != "200" ]; then
            echo "错误: GET /api/comments/$COMMENT_ID/replies 返回状态码 $http_code"
            echo "响应体: $(cat response_body.txt)"
            errors+=("GET /api/comments/$COMMENT_ID/replies - 状态码: $http_code, 响应: $(cat response_body.txt)")
        else
            echo "成功: GET /api/comments/$COMMENT_ID/replies"
        fi
        echo ""
        
        # 测试删除评论
        echo "测试: DELETE /api/comments/$COMMENT_ID"
        response=$(curl -s -o response_body.txt -w "%{http_code}" -X DELETE "$BASE_URL/api/comments/$COMMENT_ID" \
          -H "Authorization: Bearer $TOKEN")
        http_code=$response
        echo "状态码: $http_code"
        if [ "$http_code" != "200" ]; then
            echo "错误: DELETE /api/comments/$COMMENT_ID 返回状态码 $http_code"
            echo "响应体: $(cat response_body.txt)"
            errors+=("DELETE /api/comments/$COMMENT_ID - 状态码: $http_code, 响应: $(cat response_body.txt)")
        else
            echo "成功: DELETE /api/comments/$COMMENT_ID"
        fi
        echo ""
    fi
fi

# 测试投票相关API
if [ -n "$TOKEN" ] && [ -n "$POST_ID_FOR_COMMENTS" ]; then
    echo "测试: POST /api/votes"
    payload="{\"postId\":\"$POST_ID_FOR_COMMENTS\",\"type\":\"upvote\"}"
    response=$(curl -s -o response_body.txt -w "%{http_code}" -X POST "$BASE_URL/api/votes" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $TOKEN" \
      -d "$payload")
    http_code=$response
    echo "状态码: $http_code"
    if [ "$http_code" != "200" ]; then
        echo "错误: POST /api/votes 返回状态码 $http_code"
        echo "响应体: $(cat response_body.txt)"
        errors+=("POST /api/votes - 状态码: $http_code, 响应: $(cat response_body.txt)")
    else
        echo "成功: POST /api/votes"
    fi
    echo ""
    
    echo "测试: GET /api/votes/$POST_ID_FOR_COMMENTS/status"
    response=$(curl -s -o response_body.txt -w "%{http_code}" -X GET "$BASE_URL/api/votes/$POST_ID_FOR_COMMENTS/status" \
      -H "Authorization: Bearer $TOKEN")
    http_code=$response
    echo "状态码: $http_code"
    if [ "$http_code" != "200" ]; then
        echo "错误: GET /api/votes/$POST_ID_FOR_COMMENTS/status 返回状态码 $http_code"
        echo "响应体: $(cat response_body.txt)"
        errors+=("GET /api/votes/$POST_ID_FOR_COMMENTS/status - 状态码: $http_code, 响应: $(cat response_body.txt)")
    else
        echo "成功: GET /api/votes/$POST_ID_FOR_COMMENTS/status"
    fi
    echo ""
    
    echo "测试: GET /api/votes/$POST_ID_FOR_COMMENTS/count"
    response=$(curl -s -o response_body.txt -w "%{http_code}" -X GET "$BASE_URL/api/votes/$POST_ID_FOR_COMMENTS/count" \
      -H "Authorization: Bearer $TOKEN")
    http_code=$response
    echo "状态码: $http_code"
    if [ "$http_code" != "200" ]; then
        echo "错误: GET /api/votes/$POST_ID_FOR_COMMENTS/count 返回状态码 $http_code"
        echo "响应体: $(cat response_body.txt)"
        errors+=("GET /api/votes/$POST_ID_FOR_COMMENTS/count - 状态码: $http_code, 响应: $(cat response_body.txt)")
    else
        echo "成功: GET /api/votes/$POST_ID_FOR_COMMENTS/count"
    fi
    echo ""
    
    echo "测试: DELETE /api/votes/$POST_ID_FOR_COMMENTS"
    response=$(curl -s -o response_body.txt -w "%{http_code}" -X DELETE "$BASE_URL/api/votes/$POST_ID_FOR_COMMENTS" \
      -H "Authorization: Bearer $TOKEN")
    http_code=$response
    echo "状态码: $http_code"
    if [ "$http_code" != "200" ]; then
        echo "错误: DELETE /api/votes/$POST_ID_FOR_COMMENTS 返回状态码 $http_code"
        echo "响应体: $(cat response_body.txt)"
        errors+=("DELETE /api/votes/$POST_ID_FOR_COMMENTS - 状态码: $http_code, 响应: $(cat response_body.txt)")
    else
        echo "成功: DELETE /api/votes/$POST_ID_FOR_COMMENTS"
    fi
    echo ""
fi

# 测试通知相关API
if [ -n "$TOKEN" ]; then
    echo "测试: GET /api/notifications"
    response=$(curl -s -o response_body.txt -w "%{http_code}" -X GET "$BASE_URL/api/notifications" \
      -H "Authorization: Bearer $TOKEN")
    http_code=$response
    echo "状态码: $http_code"
    if [ "$http_code" != "200" ]; then
        echo "错误: GET /api/notifications 返回状态码 $http_code"
        echo "响应体: $(cat response_body.txt)"
        errors+=("GET /api/notifications - 状态码: $http_code, 响应: $(cat response_body.txt)")
    else
        echo "成功: GET /api/notifications"
    fi
    echo ""
    
    echo "测试: GET /api/notifications/unread-count"
    response=$(curl -s -o response_body.txt -w "%{http_code}" -X GET "$BASE_URL/api/notifications/unread-count" \
      -H "Authorization: Bearer $TOKEN")
    http_code=$response
    echo "状态码: $http_code"
    if [ "$http_code" != "200" ]; then
        echo "错误: GET /api/notifications/unread-count 返回状态码 $http_code"
        echo "响应体: $(cat response_body.txt)"
        errors+=("GET /api/notifications/unread-count - 状态码: $http_code, 响应: $(cat response_body.txt)")
    else
        echo "成功: GET /api/notifications/unread-count"
    fi
    echo ""
    
    # 获取一个通知ID进行后续测试（如果没有通知，则跳过）
    NOTIFICATION_ID=$(grep -o '"id":"[^"]*"' response_body.txt | head -n1 | cut -d'"' -f4)
    if [ -n "$NOTIFICATION_ID" ]; then
        echo "测试: PATCH /api/notifications/$NOTIFICATION_ID/read"
        response=$(curl -s -o response_body.txt -w "%{http_code}" -X PATCH "$BASE_URL/api/notifications/$NOTIFICATION_ID/read" \
          -H "Authorization: Bearer $TOKEN")
        http_code=$response
        echo "状态码: $http_code"
        if [ "$http_code" != "200" ]; then
            echo "错误: PATCH /api/notifications/$NOTIFICATION_ID/read 返回状态码 $http_code"
            echo "响应体: $(cat response_body.txt)"
            errors+=("PATCH /api/notifications/$NOTIFICATION_ID/read - 状态码: $http_code, 响应: $(cat response_body.txt)")
        else
            echo "成功: PATCH /api/notifications/$NOTIFICATION_ID/read"
        fi
        echo ""
        
        echo "测试: DELETE /api/notifications/$NOTIFICATION_ID"
        response=$(curl -s -o response_body.txt -w "%{http_code}" -X DELETE "$BASE_URL/api/notifications/$NOTIFICATION_ID" \
          -H "Authorization: Bearer $TOKEN")
        http_code=$response
        echo "状态码: $http_code"
        if [ "$http_code" != "200" ]; then
            echo "错误: DELETE /api/notifications/$NOTIFICATION_ID 返回状态码 $http_code"
            echo "响应体: $(cat response_body.txt)"
            errors+=("DELETE /api/notifications/$NOTIFICATION_ID - 状态码: $http_code, 响应: $(cat response_body.txt)")
        else
            echo "成功: DELETE /api/notifications/$NOTIFICATION_ID"
        fi
        echo ""
    fi
    
    echo "测试: PATCH /api/notifications/read-all"
    response=$(curl -s -o response_body.txt -w "%{http_code}" -X PATCH "$BASE_URL/api/notifications/read-all" \
      -H "Authorization: Bearer $TOKEN")
    http_code=$response
    echo "状态码: $http_code"
    if [ "$http_code" != "200" ]; then
        echo "错误: PATCH /api/notifications/read-all 返回状态码 $http_code"
        echo "响应体: $(cat response_body.txt)"
        errors+=("PATCH /api/notifications/read-all - 状态码: $http_code, 响应: $(cat response_body.txt)")
    else
        echo "成功: PATCH /api/notifications/read-all"
    fi
    echo ""
fi

# 测试聊天相关API
if [ -n "$TOKEN" ]; then
    echo "测试: GET /api/chats/conversations"
    response=$(curl -s -o response_body.txt -w "%{http_code}" -X GET "$BASE_URL/api/chats/conversations" \
      -H "Authorization: Bearer $TOKEN")
    http_code=$response
    echo "状态码: $http_code"
    if [ "$http_code" != "200" ]; then
        echo "错误: GET /api/chats/conversations 返回状态码 $http_code"
        echo "响应体: $(cat response_body.txt)"
        errors+=("GET /api/chats/conversations - 状态码: $http_code, 响应: $(cat response_body.txt)")
    else
        echo "成功: GET /api/chats/conversations"
    fi
    echo ""
    
    # 发送消息需要另一个用户，所以这里我们跳过发送消息的测试
    # 或者我们可以尝试与系统或自己对话（取决于实现）
    # 这里我们只测试获取聊天
    if [ -n "$USER_ID" ]; then
        echo "测试: GET /api/chats/$USER_ID"
        response=$(curl -s -o response_body.txt -w "%{http_code}" -X GET "$BASE_URL/api/chats/$USER_ID" \
          -H "Authorization: Bearer $TOKEN")
        http_code=$response
        echo "状态码: $http_code"
        if [ "$http_code" != "200" ]; then
            echo "错误: GET /api/chats/$USER_ID 返回状态码 $http_code"
            echo "响应体: $(cat response_body.txt)"
            errors+=("GET /api/chats/$USER_ID - 状态码: $http_code, 响应: $(cat response_body.txt)")
        else
            echo "成功: GET /api/chats/$USER_ID"
        fi
        echo ""
    fi
fi

# 测试群组相关API
if [ -n "$TOKEN" ]; then
    echo "测试: GET /api/groups"
    response=$(curl -s -o response_body.txt -w "%{http_code}" -X GET "$BASE_URL/api/groups" \
      -H "Authorization: Bearer $TOKEN")
    http_code=$response
    echo "状态码: $http_code"
    if [ "$http_code" != "200" ]; then
        echo "错误: GET /api/groups 返回状态码 $http_code"
        echo "响应体: $(cat response_body.txt)"
        errors+=("GET /api/groups - 状态码: $http_code, 响应: $(cat response_body.txt)")
    else
        echo "成功: GET /api/groups"
    fi
    echo ""
    
    # 创建一个群组用于后续测试
    echo "测试: POST /api/groups"
    payload="{\"name\":\"Test Group\",\"description\":\"A test group for API testing\"}"
    response=$(curl -s -o response_body.txt -w "%{http_code}" -X POST "$BASE_URL/api/groups" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $TOKEN" \
      -d "$payload")
    http_code=$response
    GROUP_ID=""
    if [ "$http_code" = "200" ] || [ "$http_code" = "201" ]; then
        echo "成功: POST /api/groups"
        GROUP_ID=$(grep -o '"id":"[^"]*"' response_body.txt | cut -d'"' -f4)
    else
        echo "错误: POST /api/groups 返回状态码 $http_code"
        echo "响应体: $(cat response_body.txt)"
        errors+=("POST /api/groups - 状态码: $http_code, 响应: $(cat response_body.txt)")
    fi
    echo ""
    
    # 如果群组创建成功，测试获取群组
    if [ -n "$GROUP_ID" ]; then
        echo "测试: GET /api/groups/$GROUP_ID"
        response=$(curl -s -o response_body.txt -w "%{http_code}" -X GET "$BASE_URL/api/groups/$GROUP_ID" \
          -H "Authorization: Bearer $TOKEN")
        http_code=$response
        echo "状态码: $http_code"
        if [ "$http_code" != "200" ]; then
            echo "错误: GET /api/groups/$GROUP_ID 返回状态码 $http_code"
            echo "响应体: $(cat response_body.txt)"
            errors+=("GET /api/groups/$GROUP_ID - 状态码: $http_code, 响应: $(cat response_body.txt)")
        else
            echo "成功: GET /api/groups/$GROUP_ID"
        fi
        echo ""
        
        # 测试发送群组消息
        echo "测试: POST /api/groups/$GROUP_ID/messages"
        payload="{\"content\":\"This is a test message in the group\"}"
        response=$(curl -s -o response_body.txt -w "%{http_code}" -X POST "$BASE_URL/api/groups/$GROUP_ID/messages" \
          -H "Content-Type: application/json" \
          -H "Authorization: Bearer $TOKEN" \
          -d "$payload")
        http_code=$response
        echo "状态码: $http_code"
        if [ "$http_code" != "200" ]; then
            echo "错误: POST /api/groups/$GROUP_ID/messages 返回状态码 $http_code"
            echo "响应体: $(cat response_body.txt)"
            errors+=("POST /api/groups/$GROUP_ID/messages - 状态码: $http_code, 响应: $(cat response_body.txt)")
        else
            echo "成功: POST /api/groups/$GROUP_ID/messages"
        fi
        echo ""
        
        # 测试获取群组消息
        echo "测试: GET /api/groups/$GROUP_ID/messages"
        response=$(curl -s -o response_body.txt -w "%{http_code}" -X GET "$BASE_URL/api/groups/$GROUP_ID/messages" \
          -H "Authorization: Bearer $TOKEN")
        http_code=$response
        echo "状态码: $http_code"
        if [ "$http_code" != "200" ]; then
            echo "错误: GET /api/groups/$GROUP_ID/messages 返回状态码 $http_code"
            echo "响应体: $(cat response_body.txt)"
            errors+=("GET /api/groups/$GROUP_ID/messages - 状态码: $http_code, 响应: $(cat response_body.txt)")
        else
            echo "成功: GET /api/groups/$GROUP_ID/messages"
        fi
        echo ""
        
        # 测试标记群组消息为已读
        echo "测试: PATCH /api/groups/$GROUP_ID/read"
        response=$(curl -s -o response_body.txt -w "%{http_code}" -X PATCH "$BASE_URL/api/groups/$GROUP_ID/read" \
          -H "Authorization: Bearer $TOKEN")
        http_code=$response
        echo "状态码: $http_code"
        if [ "$http_code" != "200" ]; then
            echo "错误: PATCH /api/groups/$GROUP_ID/read 返回状态码 $http_code"
            echo "响应体: $(cat response_body.txt)"
            errors+=("PATCH /api/groups/$GROUP_ID/read - 状态码: $http_code, 响应: $(cat response_body.txt)")
        else
            echo "成功: PATCH /api/groups/$GROUP_ID/read"
        fi
        echo ""
        
        # 测试离开群组
        echo "测试: POST /api/groups/$GROUP_ID/leave"
        response=$(curl -s -o response_body.txt -w "%{http_code}" -X POST "$BASE_URL/api/groups/$GROUP_ID/leave" \
          -H "Authorization: Bearer $TOKEN")
        http_code=$response
        echo "状态码: $http_code"
        if [ "$http_code" != "200" ]; then
            echo "错误: POST /api/groups/$GROUP_ID/leave 返回状态码 $http_code"
            echo "响应体: $(cat response_body.txt)"
            errors+=("POST /api/groups/$GROUP_ID/leave - 状态码: $http_code, 响应: $(cat response_body.txt)")
        else
            echo "成功: POST /api/groups/$GROUP_ID/leave"
        fi
        echo ""
        
        # 重新加入群组以便测试解散群组
        echo "重新加入群组以测试解散功能"
        response=$(curl -s -o response_body_join.txt -w "%{http_code}" -X POST "$BASE_URL/api/groups/$GROUP_ID/join" \
          -H "Authorization: Bearer $TOKEN")
        join_http_code=$response
        if [ "$join_http_code" = "200" ]; then
            echo "成功重新加入群组"
        else
            echo "重新加入群组失败"
        fi
        echo ""
    fi
fi

# 输出错误汇总
echo "====================="
echo "错误汇总:"
if [ ${#errors[@]} -eq 0 ]; then
    echo "所有API测试通过！"
else
    for error in "${errors[@]}"; do
        echo "$error"
    done
fi

# 清理临时文件
rm -f response_body.txt response_body2.txt