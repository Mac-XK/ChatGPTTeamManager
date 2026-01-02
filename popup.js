document.addEventListener('DOMContentLoaded', () => {
    // 初始化 - 恢复上次的页面
    const lastView = localStorage.getItem('lastView') || 'home';
    if (lastView === 'settings') {
        showSettings();
    } else {
        showHome();
    }

    // 事件监听
    document.getElementById('menu-btn').addEventListener('click', openDrawer);
    document.getElementById('drawer-overlay').addEventListener('click', closeDrawer);

    document.getElementById('nav-home').addEventListener('click', () => { closeDrawer(); showHome(); });
    document.getElementById('nav-settings').addEventListener('click', () => { closeDrawer(); showSettings(); });

    const refreshBtn = document.getElementById('refresh-stats-btn');
    if (refreshBtn) refreshBtn.addEventListener('click', () => {
        refreshBtn.classList.add('rotating');
        loadStatsForHome().then(() => {
            setTimeout(() => refreshBtn.classList.remove('rotating'), 500);
            showToast('数据已刷新');
        });
    });

    document.getElementById('save-config').addEventListener('click', saveConfig);

    // 添加表单切换
    const btnShowAdd = document.getElementById('btn-show-add-form');
    if (btnShowAdd) {
        btnShowAdd.addEventListener('click', () => {
            document.getElementById('add-form-container').classList.remove('hidden');
            btnShowAdd.classList.add('hidden');
            document.getElementById('add-form-container').scrollIntoView({ behavior: 'smooth' });
        });
    }

    document.getElementById('cancel-add').addEventListener('click', () => {
        document.getElementById('add-form-container').classList.add('hidden');
        if (btnShowAdd) btnShowAdd.classList.remove('hidden');
    });

    // 导出功能
    document.getElementById('btn-export').addEventListener('click', exportAccounts);

    // 导入功能
    document.getElementById('btn-import').addEventListener('click', () => {
        document.getElementById('import-file-input').click();
    });

    document.getElementById('import-file-input').addEventListener('change', importAccounts);

    // 自动填充 Token
    const autoFillBtn = document.getElementById('auto-fill-token');
    if (autoFillBtn) {
        autoFillBtn.addEventListener('click', async () => {

            autoFillBtn.textContent = '获取中...';
            try {
                // 通过 API 获取真正的 accessToken
                const response = await fetch('https://chatgpt.com/api/auth/session', {
                    method: 'GET',
                    credentials: 'include'  // 自动携带 cookies
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.accessToken) {
                        document.getElementById('cfg-token').value = data.accessToken;
                        autoFillBtn.textContent = '获取成功';
                        setTimeout(() => autoFillBtn.textContent = '自动获取', 2000);
                    } else {
                        alert('未找到 accessToken，请确保您已登录 chatgpt.com');
                        autoFillBtn.textContent = '自动获取';
                    }
                } else {
                    alert('获取 Token 失败，请确保您已登录 chatgpt.com');
                    autoFillBtn.textContent = '自动获取';
                }
            } catch (e) {
                alert('无法获取 Token: ' + e.message);
                autoFillBtn.textContent = '自动获取';
            }
        });
    }

    // 自动获取 Account ID
    const autoGetIdBtn = document.getElementById('auto-get-id');
    if (autoGetIdBtn) {
        autoGetIdBtn.addEventListener('click', async () => {
            autoGetIdBtn.textContent = '获取中...';

            // 优先从 _account cookie 获取
            try {
                // 1. 获取当前活动 Tab 的 storeId (关键：区分正常/无痕模式)
                const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
                const currentTab = tabs[0];
                const storeId = currentTab ? currentTab.cookieStoreId : null;


                // 2. 指定 storeId 获取 Cookies
                const cookies = await chrome.cookies.getAll({
                    name: "_account",
                    storeId: storeId
                });

                if (chrome.runtime.lastError) {
                }


                if (cookies && cookies.length > 0) {
                    // 优先选择带 chatgpt.com 且不是 hostOnly 的，或者第一个
                    let targetCookie = cookies.find(c => c.domain.includes('chatgpt.com') && !c.hostOnly)
                        || cookies.find(c => c.domain.includes('chatgpt.com'))
                        || cookies[0];

                    document.getElementById('cfg-id').value = targetCookie.value;
                    autoGetIdBtn.textContent = '获取成功';
                    // alert(`已从 Cookie 获取 Account ID: ${targetCookie.value}\n(来自: ${targetCookie.domain})`);
                    setTimeout(() => autoGetIdBtn.textContent = '自动获取', 3000);
                    return;
                }
            } catch (e) {
            }

            // 备选方案: 通过 API 获取
            const tokenInput = document.getElementById('cfg-token');
            let token = tokenInput.value.trim();

            if (!token) {
                alert('未找到 _account cookie，请填写 Token 后重试');
                autoGetIdBtn.textContent = '自动获取';
                return;
            }

            if (!token.startsWith('Bearer ')) {
                token = `Bearer ${token}`;
            }

            try {
                const response = await fetch('https://chatgpt.com/backend-api/accounts/check/v4-2023-04-27', {
                    method: 'GET',
                    headers: {
                        'Authorization': token,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    const accounts = data.accounts || {};

                    let foundId = null;
                    let foundName = '';

                    // 优先选择 Team 账号 (org-*)
                    for (const [id, info] of Object.entries(accounts)) {
                        if (id.startsWith('org-') || info.plan_type === 'team') {
                            foundId = id;
                            foundName = info.name || id;
                            break;
                        }
                    }

                    // 备选方案
                    if (!foundId && Object.keys(accounts).length > 0) {
                        foundId = Object.keys(accounts)[0];
                        foundName = accounts[foundId].name || foundId;
                    }

                    if (foundId) {
                        document.getElementById('cfg-id').value = foundId;
                        const nameInput = document.getElementById('cfg-name');
                        if (!nameInput.value && foundName) {
                            nameInput.value = foundName;
                        }
                        autoGetIdBtn.textContent = '获取成功';
                        alert(`已自动填入账号: ${foundName} (${foundId})`);
                    } else {
                        alert('未找到有效账号');
                        autoGetIdBtn.textContent = '自动获取';
                    }
                } else {
                    alert(`获取失败 (${response.status}) - 请检查 Token`);
                    autoGetIdBtn.textContent = '自动获取';
                }
            } catch (e) {
                alert('请求异常: ' + e.message);
                autoGetIdBtn.textContent = '自动获取';
            }

            setTimeout(() => {
                if (autoGetIdBtn.textContent === '获取成功') autoGetIdBtn.textContent = '自动获取';
            }, 3000);
        });
    }
});

// ==================== 导航功能 ====================
function openDrawer() {
    document.getElementById('drawer').classList.add('active');
    document.getElementById('drawer-overlay').classList.remove('hidden');
    requestAnimationFrame(() => {
        document.getElementById('drawer-overlay').classList.add('active');
    });
}

function closeDrawer() {
    document.getElementById('drawer').classList.remove('active');
    document.getElementById('drawer-overlay').classList.remove('active');
    setTimeout(() => {
        document.getElementById('drawer-overlay').classList.add('hidden');
    }, 300);
}

function showHome() {
    document.getElementById('home-view').classList.remove('hidden');
    document.getElementById('settings-view').classList.add('hidden');
    localStorage.setItem('lastView', 'home');  // 记住当前页面
    loadStatsForHome();
}

function showSettings() {
    document.getElementById('home-view').classList.add('hidden');
    document.getElementById('settings-view').classList.remove('hidden');
    localStorage.setItem('lastView', 'settings');  // 记住当前页面
    loadSavedConfigsList();
}

// ==================== 首页/统计逻辑 ====================
async function loadStatsForHome() {
    const data = await chrome.storage.local.get('teams');
    const teams = data.teams || [];

    // 统计累加器
    let totalAccounts = teams.length;
    let totalJoined = 0;
    let totalPending = 0;
    let totalAvailable = 0;
    let totalSeats = 0;

    // 使用 API 获取真实统计数据
    for (const team of teams) {
        const stats = await fetchTeamStats(team);
        if (stats) {
            totalJoined += stats.joined;
            totalPending += stats.pending;
            totalAvailable += stats.available;
            totalSeats += stats.total;
        } else {
            // API 失败时用本地数据回退
            const storeKey = `invited_${team.account_id}`;
            const localData = await chrome.storage.local.get(storeKey);
            const invitedList = localData[storeKey] || [];
            totalPending += invitedList.length;
            totalAvailable += Math.max(0, team.max_invites - invitedList.length);
            totalSeats += team.max_invites;
        }
    }

    // 更新仪表盘 UI
    const setStat = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
    };

    setStat('stat-total-accounts', totalAccounts);
    setStat('stat-total-invites', totalJoined);  // 已加入 = joined
    setStat('stat-pending', totalPending);       // 待接受 = pending
    setStat('stat-available', totalAvailable);   // 剩余席位
}

// ==================== 账号/设置逻辑 ====================
async function loadSavedConfigsList() {
    const container = document.getElementById('saved-configs-list'); // 账号列表容器
    if (!container) return;

    container.innerHTML = '';

    const data = await chrome.storage.local.get('teams');
    const teams = data.teams || [];

    if (teams.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>暂无账号</p>
                <p style="font-size:12px;color:#999;">点击右上角 + 添加</p>
            </div>`;
        return;
    }

    const template = document.getElementById('card-template');

    for (const [idx, team] of teams.entries()) {
        const clone = template.content.cloneNode(true);

        // 0. 序号
        const seqEl = clone.querySelector('.team-seq');
        if (seqEl) seqEl.textContent = idx + 1;

        // 1. 基本信息
        clone.querySelector('.team-name').textContent = team.name;
        clone.querySelector('.meta-id').textContent = team.account_id;
        clone.querySelector('.meta-date').textContent = new Date().toLocaleDateString();
        clone.querySelector('.num-total').textContent = team.max_invites;

        // 2. 卡片统计 - 从 API 获取真实数据
        const joinedEl = clone.querySelector('.num-joined');
        const pendingEl = clone.querySelector('.num-pending');
        const availableEl = clone.querySelector('.num-available');
        const totalEl = clone.querySelector('.num-total');
        const bar = clone.querySelector('.progress-bar');

        // 先显示加载中状态
        if (joinedEl) joinedEl.textContent = '...';
        if (pendingEl) pendingEl.textContent = '...';
        if (availableEl) availableEl.textContent = '...';

        // 异步获取真实统计数据
        fetchTeamStats(team).then(stats => {
            if (stats) {
                if (joinedEl) joinedEl.textContent = stats.joined;
                if (pendingEl) pendingEl.textContent = stats.pending;
                if (availableEl) availableEl.textContent = stats.available;
                if (totalEl) totalEl.textContent = stats.total;
                const pct = Math.floor(((stats.joined + stats.pending) / stats.total) * 100);
                if (bar) bar.style.width = `${pct}%`;
            } else {
                // API 失败时使用本地数据作为备用
                const storeKey = `invited_${team.account_id}`;
                chrome.storage.local.get(storeKey).then(localData => {
                    const invitedList = localData[storeKey] || [];
                    const count = invitedList.length;
                    if (joinedEl) joinedEl.textContent = 0;
                    if (pendingEl) pendingEl.textContent = count;
                    if (availableEl) availableEl.textContent = Math.max(0, team.max_invites - count);
                    const pct = Math.floor((count / team.max_invites) * 100);
                    if (bar) bar.style.width = `${pct}%`;
                });
            }
        });

        // 3. 更多选项逻辑
        const moreBtn = clone.querySelector('.more-options');
        const dropdown = clone.querySelector('.dropdown-menu');

        // 切换菜单
        moreBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            document.querySelectorAll('.dropdown-menu').forEach(el => {
                if (el !== dropdown) el.classList.add('hidden');
            });
            dropdown.classList.toggle('hidden');
        });

        // 点击外部关闭
        document.addEventListener('click', () => {
            if (!dropdown.classList.contains('hidden')) {
                dropdown.classList.add('hidden');
            }
        });

        // 操作按钮
        // 刷新
        clone.querySelector('.action-refresh').addEventListener('click', async (e) => {
            e.stopPropagation();
            dropdown.classList.add('hidden');
            // 重新渲染列表来刷新数据
            await loadSavedConfigsList();
            showToast('数据已刷新');
        });

        // 邀请 -> 打开弹窗
        clone.querySelector('.action-invite').addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.add('hidden');

            // 打开弹窗
            currentInviteTeam = team;
            document.getElementById('modal-team-name').textContent = team.name;
            const overlay = document.getElementById('invite-modal-overlay');
            const modal = document.getElementById('invite-modal');

            overlay.classList.remove('hidden');
            modal.classList.remove('hidden');

            requestAnimationFrame(() => {
                overlay.classList.add('active');
                modal.classList.add('active');
            });

            document.getElementById('modal-invite-email').focus();
        });

        // 删除 -> 打开确认弹窗
        clone.querySelector('.action-delete').addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.add('hidden');

            // 打开删除确认弹窗
            currentDeleteTeam = { team, idx };
            document.getElementById('modal-delete-team-name').textContent = team.name;

            const overlay = document.getElementById('delete-modal-overlay');
            const modal = document.getElementById('delete-modal');

            overlay.classList.remove('hidden');
            modal.classList.remove('hidden');

            requestAnimationFrame(() => {
                overlay.classList.add('active');
                modal.classList.add('active');
            });
        });

        container.appendChild(clone);
    }
}


async function saveConfig() {
    const name = document.getElementById('cfg-name').value;
    const id = document.getElementById('cfg-id').value;
    const token = document.getElementById('cfg-token').value;
    const max = parseInt(document.getElementById('cfg-max').value || 4);

    if (!name || !id || !token) {
        alert('请填写完整信息');
        return;
    }

    const data = await chrome.storage.local.get('teams');
    const teams = data.teams || [];

    // 检查重复的 Account ID
    const existingIndex = teams.findIndex(t => t.account_id === id);

    if (existingIndex !== -1) {
        // 更新已存在的账号
        teams[existingIndex] = {
            name,
            account_id: id,
            auth_token: token,
            max_invites: max
        };
    } else {
        // 添加新账号
        teams.push({
            name,
            account_id: id,
            auth_token: token,
            max_invites: max
        });
    }

    await chrome.storage.local.set({ teams });
    showToast('配置已保存');

    // 刷新列表并重置表单
    loadSavedConfigsList();
    document.getElementById('add-form-container').classList.add('hidden');
    const btnShowAdd = document.getElementById('btn-show-add-form');
    if (btnShowAdd) btnShowAdd.classList.remove('hidden');

    // 清空输入框
    document.getElementById('cfg-name').value = '';
    document.getElementById('cfg-id').value = '';
    document.getElementById('cfg-token').value = '';
}

// ==================== 邀请弹窗逻辑 ====================
let currentInviteTeam = null;

document.addEventListener('DOMContentLoaded', () => {
    // 弹窗监听器
    const modalOverlay = document.getElementById('invite-modal-overlay');
    const modal = document.getElementById('invite-modal');
    const closeBtn = document.getElementById('close-invite-modal');
    const confirmBtn = document.getElementById('btn-send-invite-confirm');

    function closeInviteModal() {
        modalOverlay.classList.remove('active');
        modal.classList.remove('active');
        // 等待过渡动画
        setTimeout(() => {
            modalOverlay.classList.add('hidden');
            modal.classList.add('hidden');
        }, 300);

        document.getElementById('modal-invite-email').value = '';
        currentInviteTeam = null;
    }

    if (closeBtn) closeBtn.addEventListener('click', closeInviteModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeInviteModal);

    if (confirmBtn) {
        confirmBtn.addEventListener('click', async () => {
            if (!currentInviteTeam) return;

            const emailInput = document.getElementById('modal-invite-email');
            const email = emailInput.value.trim();

            if (!email) {
                showToast('请输入邮箱');
                return;
            }

            confirmBtn.disabled = true;
            confirmBtn.textContent = '发送中...';

            try {
                const res = await sendInvite(email, currentInviteTeam);
                if (res.success) {
                    closeInviteModal();
                    showToast(`已邀请 ${email}`);
                    await loadSavedConfigsList(); // 刷新列表更新统计
                } else {
                    alert(res.message); // 显示错误信息
                }
            } catch (e) {
                alert('发送失败: ' + e.message);
            } finally {
                confirmBtn.disabled = false;
                confirmBtn.textContent = '立即发送';
            }
        });
    }
});



function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;

    const textEl = toast.querySelector('.toast-text');
    if (textEl) {
        textEl.textContent = message;
    }

    toast.classList.remove('hidden');
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.classList.add('hidden'), 400);
    }, 2500);
}

// ==================== API 逻辑 ====================

// 获取团队真实统计数据
async function fetchTeamStats(team) {
    let token = team.auth_token.trim();
    if (!token.startsWith('Bearer ')) {
        token = `Bearer ${token}`;
    }

    // 获取 oai-did
    let deviceId = '';
    try {
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        const storeId = tabs[0] ? tabs[0].cookieStoreId : null;
        const cookies = await chrome.cookies.getAll({ name: 'oai-did', storeId: storeId });
        if (cookies && cookies.length > 0) {
            deviceId = cookies.find(c => c.domain.includes('chatgpt.com'))?.value || cookies[0].value;
        }
    } catch (e) { }

    const headers = {
        'accept': '*/*',
        'Authorization': token,
        'chatgpt-account-id': team.account_id,
        'Content-Type': 'application/json',
        'oai-device-id': deviceId,
        'oai-language': 'en-US'
    };

    try {
        // 获取邀请列表 (pending invites)
        const invitesRes = await fetch(
            `https://chatgpt.com/backend-api/accounts/${team.account_id}/invites`,
            { method: 'GET', headers }
        );

        let pendingCount = 0;
        if (invitesRes.ok) {
            const invitesData = await invitesRes.json();

            // API 返回格式: { items: [...], total: N }
            // items 里的都是待接受的邀请（没有 status 字段）
            if (invitesData.total !== undefined) {
                pendingCount = invitesData.total;
            } else if (invitesData.items) {
                pendingCount = invitesData.items.length;
            } else if (Array.isArray(invitesData)) {
                pendingCount = invitesData.length;
            }
        } else {
        }

        // 获取团队成员列表 (joined users)
        const usersRes = await fetch(
            `https://chatgpt.com/backend-api/accounts/${team.account_id}/users`,
            { method: 'GET', headers }
        );

        let joinedCount = 0;
        let totalSeats = team.max_invites;
        if (usersRes.ok) {
            const usersData = await usersRes.json();

            // 根据实际 API 返回格式解析
            // items 包含所有成员（含管理员），需要减去 1 个管理员
            if (usersData.items) {
                // items 没有 role 字段，直接减去管理员
                joinedCount = Math.max(0, usersData.items.length - 1);
            } else if (usersData.total !== undefined) {
                // total 包含所有人，减去 1 个管理员
                joinedCount = Math.max(0, usersData.total - 1);
            } else if (Array.isArray(usersData)) {
                joinedCount = Math.max(0, usersData.length - 1);
            } else if (usersData.users) {
                joinedCount = Math.max(0, usersData.users.length - 1);
            } else if (usersData.members) {
                joinedCount = Math.max(0, usersData.members.length - 1);
            }

            // 如果 API 返回了真实席位数，使用它
            if (usersData.seat_count) {
                totalSeats = usersData.seat_count;
            }
        } else {
        }

        return {
            joined: joinedCount,
            pending: pendingCount,
            total: totalSeats,
            available: Math.max(0, totalSeats - joinedCount - pendingCount)
        };
    } catch (e) {
        // 如果 API 失败，返回默认值
        return null;
    }
}

async function sendInvite(email, team) {
    const url = `https://chatgpt.com/backend-api/accounts/${team.account_id}/invites`;

    // 自动添加 Bearer 前缀
    let token = team.auth_token.trim();
    if (!token.startsWith('Bearer ')) {
        token = `Bearer ${token}`;
    }

    // 获取 oai-did (Device ID) Cookie
    let deviceId = '';
    try {
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        const storeId = tabs[0] ? tabs[0].cookieStoreId : null;
        const cookies = await chrome.cookies.getAll({ name: 'oai-did', storeId: storeId });
        if (cookies && cookies.length > 0) {
            deviceId = cookies.find(c => c.domain.includes('chatgpt.com'))?.value || cookies[0].value;
        }
    } catch (e) {
        // 如果获取失败，继续尝试发送（可能不需要此 header）
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'accept': '*/*',
                'accept-language': 'en-US,en;q=0.9',
                'Authorization': token,
                'chatgpt-account-id': team.account_id,
                'Content-Type': 'application/json',
                'origin': 'https://chatgpt.com',
                'referer': 'https://chatgpt.com/',
                'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
                'oai-device-id': deviceId,  // 新增 Device ID
                'oai-language': 'en-US'     // 新增语言偏好
            },
            body: JSON.stringify({
                "email_addresses": [email],
                "role": "standard-user",
                "resend_emails": true
            })
        });

        if (response.ok) {
            const data = await response.json();
            // 成功处理逻辑
            if (data.account_invites) {
                await recordInviteLocally(team.account_id, email);
                return { success: true };
            } else if (data.errored_emails && data.errored_emails.length > 0) {
                return { success: false, message: "邮箱无效或受限" };
            }
            // 备选成功
            await recordInviteLocally(team.account_id, email);
            return { success: true };
        } else {
            let msg = `请求失败 (${response.status})`;
            if (response.status === 401 || response.status === 403) {
                msg = 'Token 已过期或权限不足，请更新 Token 后重试';
            } else if (response.status === 429) {
                msg = '请求太频繁，请稍后再试';
            }
            return { success: false, message: msg };
        }
    } catch (e) {
        return { success: false, message: e.message };
    }
}

async function recordInviteLocally(accountId, email) {
    const storeKey = `invited_${accountId}`;
    const data = await chrome.storage.local.get(storeKey);
    const list = data[storeKey] || [];

    // 检查邮箱是否已存在（处理对象和字符串两种格式）
    const exists = list.some(item => {
        const e = (typeof item === 'object') ? item.email : item;
        return e === email;
    });

    if (!exists) {
        list.push({
            email: email,
            time: Date.now()
        });
        await chrome.storage.local.set({ [storeKey]: list });
    }
}

// ==================== 删除弹窗逻辑 ====================
let currentDeleteTeam = null; // { team, idx }

// ==================== 导出/导入逻辑 ====================
async function exportAccounts() {
    const data = await chrome.storage.local.get('teams');
    const teams = data.teams || [];

    if (teams.length === 0) {
        showToast('暂无账号可导出');
        return;
    }

    const exportData = {
        version: '1.0',
        exportTime: new Date().toISOString(),
        teams: teams
    };

    const jsonStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `chatgpt-accounts-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast(`已导出 ${teams.length} 个账号`);
}

async function importAccounts(event) {
    const file = event.target.files[0];
    if (!file) return;

    try {
        const text = await file.text();
        const importData = JSON.parse(text);

        // 验证数据格式
        let teamsToImport = [];
        if (importData.teams && Array.isArray(importData.teams)) {
            teamsToImport = importData.teams;
        } else if (Array.isArray(importData)) {
            teamsToImport = importData;
        } else {
            throw new Error('无效的文件格式');
        }

        // 验证每个账号的必要字段
        for (const team of teamsToImport) {
            if (!team.name || !team.account_id || !team.auth_token) {
                throw new Error('账号数据不完整，缺少必要字段');
            }
        }

        // 获取现有账号
        const data = await chrome.storage.local.get('teams');
        const existingTeams = data.teams || [];

        // 合并账号（按 account_id 去重，新导入的覆盖旧的）
        const mergedTeams = [...existingTeams];
        let newCount = 0;
        let updateCount = 0;

        for (const importTeam of teamsToImport) {
            const existingIndex = mergedTeams.findIndex(t => t.account_id === importTeam.account_id);
            if (existingIndex !== -1) {
                mergedTeams[existingIndex] = {
                    name: importTeam.name,
                    account_id: importTeam.account_id,
                    auth_token: importTeam.auth_token,
                    max_invites: importTeam.max_invites || 4
                };
                updateCount++;
            } else {
                mergedTeams.push({
                    name: importTeam.name,
                    account_id: importTeam.account_id,
                    auth_token: importTeam.auth_token,
                    max_invites: importTeam.max_invites || 4
                });
                newCount++;
            }
        }

        await chrome.storage.local.set({ teams: mergedTeams });
        await loadSavedConfigsList();

        let msg = '';
        if (newCount > 0 && updateCount > 0) {
            msg = `导入成功：新增 ${newCount} 个，更新 ${updateCount} 个`;
        } else if (newCount > 0) {
            msg = `导入成功：新增 ${newCount} 个账号`;
        } else if (updateCount > 0) {
            msg = `导入成功：更新 ${updateCount} 个账号`;
        }
        showToast(msg);

    } catch (e) {
        alert('导入失败: ' + e.message);
    }

    // 清空 input 以便再次选择同一文件
    event.target.value = '';
}

document.addEventListener('DOMContentLoaded', () => {
    const modalOverlay = document.getElementById('delete-modal-overlay');
    const modal = document.getElementById('delete-modal');
    const closeBtn = document.getElementById('close-delete-modal');
    const cancelBtn = document.getElementById('btn-cancel-delete');
    const confirmBtn = document.getElementById('btn-confirm-delete');

    function closeDeleteModal() {
        if (modalOverlay) {
            modalOverlay.classList.remove('active');
            if (modal) modal.classList.remove('active');

            setTimeout(() => {
                modalOverlay.classList.add('hidden');
                if (modal) modal.classList.add('hidden');
            }, 300);
        }
        currentDeleteTeam = null;
    }

    [closeBtn, cancelBtn, modalOverlay].forEach(btn => {
        if (btn) btn.addEventListener('click', closeDeleteModal);
    });

    if (confirmBtn) {
        confirmBtn.addEventListener('click', async () => {
            if (!currentDeleteTeam) return;

            // 执行删除
            const { team, idx } = currentDeleteTeam;

            confirmBtn.disabled = true;
            confirmBtn.textContent = '移除中...';

            try {
                // 获取最新数据确保索引正确
                const data = await chrome.storage.local.get('teams');
                const teams = data.teams || [];

                // 通过 ID 重新查找索引以确保安全
                const realIndex = teams.findIndex(t => t.account_id === team.account_id);
                if (realIndex !== -1) {
                    teams.splice(realIndex, 1);
                    await chrome.storage.local.set({ teams });
                    await loadSavedConfigsList(); // 刷新 UI
                    showToast('账号已安全移除');
                } else {
                    showToast('账号未找到或已删除');
                }
                closeDeleteModal();
            } catch (e) {
                showToast('删除失败');
            } finally {
                confirmBtn.disabled = false;
                confirmBtn.textContent = '确认移除';
            }
        });
    }
});
