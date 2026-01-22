// 测试通知功能的Node.js脚本

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000/api';

console.log('开始测试通知功能...');

let token1, token2, user1_id, user2_id, post_id, comment_id;

try {
  // 注册第一个用户
  console.log('注册用户1...');
  let response1 = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'test1@example.com',
      password: 'password123',
      name: 'Test User 1'
    })
  });

  let data1 = await response1.json();
  token1 = data1.data?.token;
  user1_id = data1.data?.user?.id;

  if (token1) {
    console.log(`用户1注册成功，ID: ${user1_id}`);
  } else {
    console.log('用户1注册失败');
    console.log(data1);
    process.exit(1);
  }

  // 注册第二个用户
  console.log('注册用户2...');
  let response2 = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'test2@example.com',
      password: 'password123',
      name: 'Test User 2'
    })
  });

  let data2 = await response2.json();
  token2 = data2.data?.token;
  user2_id = data2.data?.user?.id;

  if (token2) {
    console.log(`用户2注册成功，ID: ${user2_id}`);
  } else {
    console.log('用户2注册失败');
    console.log(data2);
    process.exit(1);
  }

  // 用户2关注用户1，应该生成关注通知
  console.log('用户2关注用户1...');
  let followResponse = await fetch(`${BASE_URL}/follows/${user1_id}`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token2}` }
  });

  let followData = await followResponse.json();
  if (followData.followed === true) {
    console.log('关注操作成功');
  } else {
    console.log('关注操作失败');
    console.log(followData);
  }

  // 等待通知生成
  await new Promise(resolve => setTimeout(resolve, 1000));

  // 用户1检查通知（应该有一个关注通知）
  console.log('用户1检查通知...');
  let notificationsResponse = await fetch(`${BASE_URL}/notifications`, {
    headers: { 'Authorization': `Bearer ${token1}` }
  });

  let notifications = await notificationsResponse.json();
  console.log(`用户1收到的通知数量: ${notifications.length}`);

  if (notifications.length > 0) {
    console.log('用户1的通知详情:');
    console.log(JSON.stringify(notifications, null, 2));
    
    // 检查是否包含关注类型的通知
    let followNotificationExists = notifications.some(n => n.type === 'FOLLOW');
    if (followNotificationExists) {
      console.log('✓ 成功接收到关注通知');
    } else {
      console.log('✗ 未找到关注类型的通知');
    }
  } else {
    console.log('✗ 用户1没有收到任何通知');
  }

  // 用户1创建一个帖子
  console.log('用户1创建帖子...');
  let postResponse = await fetch(`${BASE_URL}/posts`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token1}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ content: '这是用户1发布的帖子' })
  });

  let postData = await postResponse.json();
  post_id = postData.id;
  if (post_id) {
    console.log(`帖子创建成功，ID: ${post_id}`);
  } else {
    console.log('帖子创建失败');
    console.log(postData);
    process.exit(1);
  }

  // 用户2给用户1的帖子点赞，应该生成点赞通知
  console.log('用户2给用户1的帖子点赞...');
  let voteResponse = await fetch(`${BASE_URL}/votes`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token2}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ postId: post_id, voteType: 'UP' })
  });

  let voteData = await voteResponse.json();
  if (voteData.voted === true) {
    console.log('点赞操作成功');
  } else {
    console.log('点赞操作失败');
    console.log(voteData);
  }

  // 等待通知生成
  await new Promise(resolve => setTimeout(resolve, 1000));

  // 用户1再次检查通知（应该有新的点赞通知）
  console.log('用户1再次检查通知...');
  notificationsResponse = await fetch(`${BASE_URL}/notifications`, {
    headers: { 'Authorization': `Bearer ${token1}` }
  });

  notifications = await notificationsResponse.json();
  console.log(`用户1当前的通知数量: ${notifications.length}`);

  if (notifications.length > 0) {
    console.log('用户1的通知详情:');
    console.log(JSON.stringify(notifications, null, 2));
    
    // 检查是否包含点赞类型的通知
    let likeNotificationExists = notifications.some(n => n.type === 'LIKE');
    if (likeNotificationExists) {
      console.log('✓ 成功接收到点赞通知');
    } else {
      console.log('✗ 未找到点赞类型的通知');
    }
  } else {
    console.log('✗ 用户1没有收到任何通知');
  }

  // 用户2评论用户1的帖子，应该生成评论通知
  console.log('用户2评论用户1的帖子...');
  let commentResponse = await fetch(`${BASE_URL}/comments`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token2}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ content: '这是用户2的评论', postId: post_id })
  });

  let commentData = await commentResponse.json();
  comment_id = commentData.id;
  if (comment_id) {
    console.log(`评论创建成功，ID: ${comment_id}`);
  } else {
    console.log('评论创建失败');
    console.log(commentData);
  }

  // 等待通知生成
  await new Promise(resolve => setTimeout(resolve, 1000));

  // 用户1再次检查通知（应该有新的评论通知）
  console.log('用户1再次检查通知...');
  notificationsResponse = await fetch(`${BASE_URL}/notifications`, {
    headers: { 'Authorization': `Bearer ${token1}` }
  });

  notifications = await notificationsResponse.json();
  console.log(`用户1当前的通知数量: ${notifications.length}`);

  if (notifications.length > 0) {
    console.log('用户1的通知详情:');
    console.log(JSON.stringify(notifications, null, 2));
    
    // 检查是否包含评论类型的通知
    let commentNotificationExists = notifications.some(n => n.type === 'COMMENT');
    if (commentNotificationExists) {
      console.log('✓ 成功接收到评论通知');
    } else {
      console.log('✗ 未找到评论类型的通知');
    }
  } else {
    console.log('✗ 用户1没有收到任何通知');
  }

  // 检查未读通知计数
  console.log('检查用户1的未读通知数...');
  let unreadCountResponse = await fetch(`${BASE_URL}/notifications/unread-count`, {
    headers: { 'Authorization': `Bearer ${token1}` }
  });

  let unreadCount = await unreadCountResponse.json();
  console.log(`用户1的未读通知数: ${unreadCount.count}`);

  // 将所有通知标记为已读
  console.log('将用户1的所有通知标记为已读...');
  let readAllResponse = await fetch(`${BASE_URL}/notifications/read-all`, {
    method: 'PATCH',
    headers: { 'Authorization': `Bearer ${token1}` }
  });

  if (readAllResponse.status === 204) {
    console.log('所有通知已标记为已读');
  } else {
    console.log('标记已读操作可能失败');
    console.log(readAllResponse.status);
  }

  // 再次检查未读通知计数，应该是0
  console.log('再次检查用户1的未读通知数（应该为0）...');
  unreadCountResponse = await fetch(`${BASE_URL}/notifications/unread-count`, {
    headers: { 'Authorization': `Bearer ${token1}` }
  });

  unreadCount = await unreadCountResponse.json();
  console.log(`用户1的未读通知数: ${unreadCount.count}`);

  console.log('通知功能测试完成！');
  
} catch (error) {
  console.error('测试过程中出现错误:', error);
  process.exit(1);
}