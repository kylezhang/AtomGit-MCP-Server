# 测试配置指南

## 环境变量说明

测试脚本现在使用以下环境变量来避免硬编码用户名和仓库名：

### 必需的环境变量

```env
ATOMGIT_TOKEN=your_personal_access_token_here
ATOMGIT_API_BASE_URL=https://api.atomgit.com
```

### 可选的测试配置变量

```env
# 测试用户名（默认: zkxw2008）
TEST_USERNAME=your_test_username

# 测试仓库名（默认: 无）
TEST_REPOSITORY=your_test_repository_name

# 测试仓库所有者（默认: TEST_USERNAME）
TEST_REPO_OWNER=your_test_repository_owner
```

## 使用示例

### 1. 使用默认配置

如果只设置了 `ATOMGIT_TOKEN`，测试脚本将使用默认的用户名 `zkxw2008`：

```bash
# .env 文件
ATOMGIT_TOKEN=your_token_here
ATOMGIT_API_BASE_URL=https://api.atomgit.com
```

运行测试：
```bash
npm run test:auth
node tests/test-comprehensive-all.mjs
```

### 2. 使用自定义用户名

要测试不同的用户，设置 `TEST_USERNAME`：

```bash
# .env 文件
ATOMGIT_TOKEN=your_token_here
ATOMGIT_API_BASE_URL=https://api.atomgit.com
TEST_USERNAME=myusername
```

### 3. 测试特定的仓库

要完整测试仓库相关的功能，需要提供仓库名和所有者：

```bash
# .env 文件
ATOMGIT_TOKEN=your_token_here
ATOMGIT_API_BASE_URL=https://api.atomgit.com
TEST_USERNAME=myusername
TEST_REPOSITORY=my-test-repo
TEST_REPO_OWNER=myusername
```

### 4. 在命令行中临时设置

不需要修改 `.env` 文件，可以在命令行中临时设置：

```bash
# Linux/Mac
TEST_USERNAME=myusername TEST_REPOSITORY=my-repo node tests/test-comprehensive-all.mjs

# Windows PowerShell
$env:TEST_USERNAME="myusername"; $env:TEST_REPOSITORY="my-repo"; node tests/test-comprehensive-all.mjs
```

## 测试脚本说明

### test.mjs
- 基础功能测试
- 使用 `TEST_USERNAME` 和 `TEST_REPOSITORY`

### test-auth.mjs
- 认证测试
- 使用 `TEST_USERNAME`、`TEST_REPOSITORY` 和 `TEST_REPO_OWNER`

### test-three-user-apis.mjs
- 专门测试三个用户 API
- 使用 `TEST_USERNAME`

### test-comprehensive.mjs
- 全面的功能测试
- 使用 `TEST_USERNAME` 和 `TEST_REPOSITORY`

### test-comprehensive-all.mjs
- 完整的所有工具测试
- 使用 `TEST_USERNAME` 和 `TEST_REPOSITORY`

### test-mcp-comprehensive.mjs
- MCP 服务器综合测试
- 使用 `TEST_USERNAME`

## 测试结果

### 成功的测试配置

如果你使用默认配置（zkxw2008），以下测试应该成功：

✅ 用户管理 (7/7 工具)
- `get_current_user`
- `get_user`
- `get_user_repos`
- `get_current_user_repos`
- `get_user_starred_repos`
- `get_current_user_starred_repos`
- `search_users`

⚠️ 仓库相关工具（需要有效的测试仓库）
- 分支管理
- 提交管理
- 标签管理
- Issues 管理
- Pull Requests 管理

### 常见问题

**Q: 为什么部分测试失败？**
A: 如果只设置了 `TEST_USERNAME` 而没有设置 `TEST_REPOSITORY`，某些需要仓库参数的测试会失败。这是正常的，因为测试脚本会使用默认的用户名，但可能无法找到公开的仓库。

**Q: 如何测试所有功能？**
A: 设置 `TEST_USERNAME`、`TEST_REPOSITORY` 和 `TEST_REPO_OWNER` 指向你自己的公开仓库：

```env
ATOMGIT_TOKEN=your_token_here
ATOMGIT_API_BASE_URL=https://api.atomgit.com
TEST_USERNAME=your_username
TEST_REPOSITORY=your_public_repository
TEST_REPO_OWNER=your_username
```

**Q: 默认用户 zkxw2008 有什么特点？**
A: zkxw2008 是一个已知的测试用户，有：
- 100 个公开仓库
- 30 个收藏的仓库
- 用户信息完全可访问

但具体的仓库路径可能不存在或不可访问，这会导致部分仓库相关测试失败。

## 环境变量优先级

测试脚本按以下顺序查找环境变量：

1. 环境变量（命令行或 .env）
2. 默认值（通常是 'zkxw2008'）
3. undefined（某些可选变量）

这意味着你可以在不修改测试脚本的情况下，通过环境变量灵活配置测试。

## 最佳实践

1. **保持 .env 文件配置**
   - 将常用的测试配置保存在 `.env` 文件中
   - 不要在每次测试时重新输入

2. **使用专门的测试用户**
   - 创建一个专门用于测试的账号
   - 确保有公开的测试仓库
   - 这样可以完整测试所有功能

3. **版本控制**
   - `.env` 文件在 `.gitignore` 中，不会被提交
   - 使用 `.env.example` 作为模板
   - 团队成员可以复制和自定义

4. **测试隔离**
   - 为不同类型的测试使用不同的环境变量
   - 例如：开发测试、CI/CD 测试、生产验证

---

**更新时间**: 2026-01-06
**适用于**: 所有测试脚本