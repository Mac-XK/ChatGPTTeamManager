# ChatGPT Team Manager

[English](#english) | [中文](#中文)

---

<a name="中文"></a>
## 中文文档

一款用于管理 ChatGPT Team 账号和邀请的 Chrome 浏览器扩展。

### 简介

ChatGPT Team Manager 是一款便捷的浏览器扩展，专为 ChatGPT Team 管理员设计。它可以帮助你轻松管理多个团队账号、批量发送邀请、实时查看统计数据，无需频繁登录 ChatGPT 后台进行操作。

<img width="394" height="614" alt="image" src="https://github.com/user-attachments/assets/85675853-4bdb-4783-941c-d23bc4cbc4a4" />
<img width="394" height="614" alt="image" src="https://github.com/user-attachments/assets/cab52a16-ef9f-415b-a8fe-5e089d0d3706" />
<img width="409" height="614" alt="image" src="https://github.com/user-attachments/assets/d6f2dbfc-44b2-470b-a820-ebd3f6f991f9" />
<img width="394" height="614" alt="image" src="https://github.com/user-attachments/assets/9391fac1-3da5-45c0-a0fd-98928b9a016b" />

### 功能特性

- **数据概览** - 首页仪表盘一目了然查看所有账号的统计信息
- **多账号管理** - 支持添加和管理多个 ChatGPT Team 账号
- **快速邀请** - 直接从扩展发送团队邀请，无需打开 ChatGPT 网站
- **自动获取凭证** - 一键获取 Token 和 Account ID，无需手动复制
- **导入导出** - 支持账号数据的 JSON 格式备份和迁移
- **实时统计** - 显示已加入、待接受、剩余席位等详细数据
- **本地存储** - 所有数据保存在本地，保护隐私安全

### 安装方法

#### 方法一：开发者模式安装（推荐）

1. **下载项目代码**
   
   方式 A - 使用 Git 克隆：
   ```bash
   git clone https://github.com/Mac-XK/ChatGPTTeamManager.git
   ```
   
   方式 B - 直接下载：
   - 点击页面上的绿色「Code」按钮
   - 选择「Download ZIP」
   - 解压下载的压缩包

2. **打开 Chrome 扩展管理页面**
   
   方式 A - 地址栏输入：
   ```
   chrome://extensions/
   ```
   
   方式 B - 通过菜单：
   - 点击 Chrome 右上角的三个点菜单
   - 选择「更多工具」
   - 点击「扩展程序」

3. **开启开发者模式**
   
   在扩展管理页面的右上角，找到「开发者模式」开关并打开


4. **加载扩展**
   
   - 点击左上角的「加载已解压的扩展程序」按钮
   - 在弹出的文件选择器中，选择你下载/解压的项目文件夹
   - 点击「选择文件夹」确认

5. **完成安装**
   
   安装成功后，扩展图标会出现在浏览器工具栏右侧。如果没有看到，点击工具栏的拼图图标，找到 ChatGPT Manager 并点击固定。

### 使用教程

#### 第一步：添加账号

1. 首先确保你已经在浏览器中登录了 chatgpt.com

2. 点击浏览器工具栏的扩展图标，打开扩展弹窗

3. 点击左上角的菜单图标（三条横线），在侧边栏中选择「账号」

4. 点击页面右上角的蓝色加号按钮，展开添加表单

5. 填写账号信息：

   | 字段 | 说明 | 获取方式 |
   |------|------|----------|
   | Team Name | 账号的备注名称，方便识别 | 自己填写，如「主账号」「备用账号」 |
   | Account ID | ChatGPT 团队账号的唯一标识 | 点击「自动获取」按钮 |
   | Auth Token | 用于 API 认证的令牌 | 点击「自动获取」按钮 |
   | 最大可邀请数 | 该账号的总席位数量 | 根据你的订阅计划填写，默认为 4 |

6. 点击「保存配置」按钮完成添加

7. 添加成功后，账号会显示在列表中，并自动获取最新的统计数据

#### 第二步：查看统计数据

1. 点击左上角菜单，选择「首页」进入数据概览页面

2. 页面显示四个统计卡片：

   | 卡片 | 含义 |
   |------|------|
   | 账号总数 | 你已添加的 ChatGPT Team 账号数量 |
   | 已邀请 | 所有账号中已成功加入团队的成员总数 |
   | 待接受 | 已发送邀请但对方尚未接受的数量 |
   | 剩余席位 | 所有账号剩余可用的邀请名额总和 |

3. 点击右上角的刷新图标可以重新获取最新数据

#### 第三步：发送邀请

1. 进入「账号」页面，找到你要使用的账号卡片

2. 点击卡片右上角的三个点菜单图标

3. 在下拉菜单中选择「邀请」

4. 在弹出的邀请窗口中：
   - 确认显示的团队名称是否正确
   - 在输入框中填写被邀请人的邮箱地址
   - 点击「立即发送」按钮

5. 发送成功后会显示提示，邀请邮件会发送到对方邮箱

6. 对方接受邀请后，统计数据会自动更新

#### 第四步：管理账号

**刷新数据**
- 点击账号卡片菜单中的「刷新」，获取该账号的最新统计

**删除账号**
- 点击账号卡片菜单中的「删除」
- 在确认弹窗中点击「确认移除」
- 注意：删除后本地记录会被清空

#### 第五步：导入导出

**导出账号数据**

1. 进入「账号」页面
2. 点击页面顶部的「导出」按钮
3. 浏览器会自动下载一个 JSON 文件，文件名格式为 `chatgpt-accounts-日期.json`
4. 该文件包含所有账号的完整信息，请妥善保管

**导入账号数据**

1. 进入「账号」页面
2. 点击页面顶部的「导入」按钮
3. 选择之前导出的 JSON 文件
4. 系统会自动处理：
   - 如果账号 ID 已存在，会更新该账号信息
   - 如果是新账号，会添加到列表中
5. 导入完成后会显示新增和更新的数量


### 项目结构

```
chatgpt-team-manager/
├── manifest.json      # Chrome 扩展配置文件，定义权限和基本信息
├── popup.html         # 扩展弹窗的 HTML 结构
├── popup.css          # 样式文件，定义界面外观
├── popup.js           # 主要的 JavaScript 逻辑代码
├── icon.png           # 扩展主图标
├── icon16.png         # 16x16 像素图标（用于工具栏）
├── icon48.png         # 48x48 像素图标（用于扩展管理页）
├── icon128.png        # 128x128 像素图标（用于 Chrome 商店）
└── README.md          # 项目说明文档
```

### 权限说明

本扩展需要以下权限才能正常工作：

| 权限 | 用途说明 |
|------|----------|
| `storage` | 在浏览器本地存储账号配置信息 |
| `activeTab` | 获取当前活动标签页的信息，用于区分正常/无痕模式 |
| `cookies` | 读取 ChatGPT 网站的登录凭证，用于自动获取 Token |
| `*://*.chatgpt.com/*` | 访问 ChatGPT 的 API 接口，用于发送邀请和获取统计 |

### 注意事项

1. **Token 有效期**
   - ChatGPT 的 Auth Token 会定期过期（通常几小时到几天）
   - 如果遇到请求失败或权限错误，请重新点击「自动获取」更新 Token

2. **使用频率限制**
   - 避免短时间内发送大量邀请，以免触发 ChatGPT 的频率限制
   - 如果遇到 429 错误，请等待几分钟后再试

3. **数据安全**
   - 导出的 JSON 文件包含 Auth Token 等敏感信息
   - 请勿将导出文件分享给他人或上传到公开平台
   - 建议定期更新 Token 以确保安全

4. **浏览器兼容性**
   - 本扩展仅支持 Chrome 浏览器
   - 也支持基于 Chromium 的浏览器，如 Edge、Brave 等
   - 不支持 Firefox、Safari 等其他浏览器

5. **无痕模式**
   - 扩展支持在无痕模式下使用
   - 但需要在扩展设置中勾选「在无痕模式下启用」

### 常见问题

**Q: 点击「自动获取」没有反应或失败？**

A: 请按以下步骤排查：
1. 确保已在当前浏览器中登录 chatgpt.com
2. 尝试刷新 ChatGPT 页面后重试
3. 检查是否在无痕模式下，如果是，确保扩展已启用无痕模式权限
4. 清除浏览器缓存后重新登录 ChatGPT

**Q: 邀请发送失败，提示 Token 过期？**

A: Token 已失效，请执行以下操作：
1. 进入账号编辑（或删除后重新添加）
2. 重新点击「自动获取」获取新的 Token
3. 保存后再次尝试发送邀请

**Q: 邀请发送失败，提示邮箱无效？**

A: 可能的原因：
1. 邮箱格式不正确，请检查是否有拼写错误
2. 该邮箱已经在团队中或已收到邀请
3. 该邮箱被 ChatGPT 限制，无法接收邀请

**Q: 统计数据显示不正确？**

A: 请尝试：
1. 点击刷新按钮重新获取数据
2. 检查 Token 是否有效
3. 确认账号 ID 是否正确

**Q: 如何在多台电脑上同步数据？**

A: 使用导入导出功能：
1. 在原电脑上导出账号数据
2. 将 JSON 文件传输到新电脑
3. 在新电脑上安装扩展并导入数据

### 更新日志

**v1.1.0**
- 新增账号导入导出功能
- 优化侧边栏样式，标题居中显示
- 移除调试代码，提升性能
- 代码注释改为中文

**v1.0.0**
- 首次发布
- 支持多账号管理
- 支持发送团队邀请
- 数据统计概览仪表盘
- 自动获取 Token 和 Account ID

---


<a name="english"></a>
## English Documentation

A Chrome browser extension for managing ChatGPT Team accounts and invitations.

### Introduction

ChatGPT Team Manager is a convenient browser extension designed for ChatGPT Team administrators. It helps you easily manage multiple team accounts, send invitations in bulk, and view real-time statistics without frequently logging into the ChatGPT backend.

### Features

- **Dashboard Overview** - View statistics for all accounts at a glance
- **Multi-Account Management** - Add and manage multiple ChatGPT Team accounts
- **Quick Invitations** - Send team invitations directly from the extension
- **Auto-Fetch Credentials** - One-click to get Token and Account ID
- **Import/Export** - Backup and migrate account data in JSON format
- **Real-time Statistics** - Display joined members, pending invitations, and available seats
- **Local Storage** - All data is stored locally to protect your privacy

### Installation

#### Developer Mode Installation (Recommended)

1. **Download the project**
   
   Option A - Clone with Git:
   ```bash
   git clone https://github.com/Mac-XK/ChatGPTTeamManager.git
   ```
   
   Option B - Direct download:
   - Click the green "Code" button on the page
   - Select "Download ZIP"
   - Extract the downloaded archive

2. **Open Chrome Extensions page**
   
   Option A - Enter in address bar:
   ```
   chrome://extensions/
   ```
   
   Option B - Via menu:
   - Click the three-dot menu in Chrome's top right corner
   - Select "More tools"
   - Click "Extensions"

3. **Enable Developer Mode**
   
   Toggle on "Developer mode" in the top right corner of the extensions page

4. **Load the extension**
   
   - Click "Load unpacked" button in the top left
   - Select the downloaded/extracted project folder
   - Click "Select Folder" to confirm

5. **Installation complete**
   
   The extension icon will appear in your browser toolbar. If not visible, click the puzzle icon and pin ChatGPT Manager.

### Usage Guide

#### Step 1: Add an Account

1. Make sure you're logged into chatgpt.com in your browser

2. Click the extension icon in the toolbar to open the popup

3. Click the menu icon (three lines) in the top left, select "账号" (Accounts) in the sidebar

4. Click the blue plus button in the top right to expand the add form

5. Fill in the account information:

   | Field | Description | How to Get |
   |-------|-------------|------------|
   | Team Name | A nickname for the account | Enter manually, e.g., "Main Account" |
   | Account ID | Unique identifier for the ChatGPT team | Click "自动获取" (Auto-fetch) |
   | Auth Token | Token for API authentication | Click "自动获取" (Auto-fetch) |
   | 最大可邀请数 | Total seats for this account | Enter based on your subscription, default is 4 |

6. Click "保存配置" (Save Config) to complete

#### Step 2: View Statistics

1. Click the menu and select "首页" (Home) to enter the dashboard

2. The page displays four statistic cards:

   | Card | Meaning |
   |------|---------|
   | 账号总数 | Total number of added accounts |
   | 已邀请 | Total members who have joined across all accounts |
   | 待接受 | Invitations sent but not yet accepted |
   | 剩余席位 | Total remaining available invitation slots |

3. Click the refresh icon to update the data

#### Step 3: Send Invitations

1. Go to the "账号" (Accounts) page and find the target account card

2. Click the three-dot menu icon in the top right of the card

3. Select "邀请" (Invite) from the dropdown menu

4. In the invitation popup:
   - Confirm the team name is correct
   - Enter the invitee's email address
   - Click "立即发送" (Send Now)

5. A success message will appear, and an invitation email will be sent

#### Step 4: Manage Accounts

**Refresh Data**
- Click "刷新" (Refresh) in the card menu to get the latest statistics

**Delete Account**
- Click "删除" (Delete) in the card menu
- Click "确认移除" (Confirm Remove) in the confirmation popup
- Note: Local records will be cleared after deletion

#### Step 5: Import/Export

**Export Account Data**

1. Go to the "账号" (Accounts) page
2. Click the "导出" (Export) button at the top
3. A JSON file will be downloaded automatically
4. Keep this file safe as it contains sensitive information

**Import Account Data**

1. Go to the "账号" (Accounts) page
2. Click the "导入" (Import) button at the top
3. Select a previously exported JSON file
4. The system will automatically:
   - Update existing accounts if the ID matches
   - Add new accounts if the ID is new
5. A message will show how many accounts were added or updated


### Project Structure

```
chatgpt-team-manager/
├── manifest.json      # Chrome extension config file
├── popup.html         # Extension popup HTML structure
├── popup.css          # Stylesheet for the interface
├── popup.js           # Main JavaScript logic
├── icon.png           # Main extension icon
├── icon16.png         # 16x16 icon (for toolbar)
├── icon48.png         # 48x48 icon (for extension page)
├── icon128.png        # 128x128 icon (for Chrome store)
└── README.md          # Documentation
```

### Permissions

| Permission | Purpose |
|------------|---------|
| `storage` | Store account configurations locally |
| `activeTab` | Get current tab info for normal/incognito mode |
| `cookies` | Read ChatGPT login credentials for auto-fetch |
| `*://*.chatgpt.com/*` | Access ChatGPT API for invitations and statistics |

### Important Notes

1. **Token Expiration**
   - ChatGPT Auth Tokens expire periodically (usually hours to days)
   - If you encounter request failures, re-fetch the Token

2. **Rate Limiting**
   - Avoid sending too many invitations in a short time
   - If you get a 429 error, wait a few minutes before retrying

3. **Data Security**
   - Exported JSON files contain sensitive Auth Tokens
   - Do not share export files or upload them to public platforms
   - Regularly update Tokens for security

4. **Browser Compatibility**
   - Only supports Chrome browser
   - Also works on Chromium-based browsers like Edge, Brave, etc.
   - Does not support Firefox, Safari, or other browsers

5. **Incognito Mode**
   - The extension supports incognito mode
   - Enable "Allow in incognito" in extension settings

### FAQ

**Q: Auto-fetch not working?**

A: Troubleshooting steps:
1. Make sure you're logged into chatgpt.com
2. Try refreshing the ChatGPT page and retry
3. Check if you're in incognito mode and ensure the extension has permission
4. Clear browser cache and re-login to ChatGPT

**Q: Invitation failed with Token expired error?**

A: The Token has expired:
1. Edit the account (or delete and re-add)
2. Click "自动获取" to get a new Token
3. Save and try sending the invitation again

**Q: Invitation failed with invalid email error?**

A: Possible reasons:
1. Email format is incorrect
2. The email is already in the team or has a pending invitation
3. The email is restricted by ChatGPT

**Q: Statistics showing incorrect data?**

A: Try:
1. Click the refresh button to re-fetch data
2. Check if the Token is valid
3. Verify the Account ID is correct

**Q: How to sync data across multiple computers?**

A: Use the import/export feature:
1. Export account data on the original computer
2. Transfer the JSON file to the new computer
3. Install the extension and import the data

### Changelog

**v1.1.0**
- Added import/export functionality
- Improved sidebar styling with centered title
- Removed debug code for better performance
- Changed code comments to Chinese

**v1.0.0**
- Initial release
- Multi-account management
- Team invitation support
- Statistics dashboard
- Auto-fetch Token and Account ID

---

## License

This project is licensed under the MIT License.

## Contributing

Issues and Pull Requests are welcome!

---

If this project helps you, please give it a Star!
