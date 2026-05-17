const { WebSocketServer } = require('ws')
const PORT = 9090
const wss = new WebSocketServer({ port: PORT })

let issues = [
    { id: '1', title: 'Crack in load-bearing wall', room: 'Room 101', severity: 'high', status: 'open', createdAt: Date.now(), reportedBy: 'Dana' },
    { id: '2', title: 'Missing fire suppression pipe', room: 'Room 203', severity: 'high', status: 'in_progress', createdAt: Date.now(), reportedBy: 'Ron' },
    { id: '3', title: 'Broken window frame', room: 'Room 305', severity: 'low', status: 'resolved', createdAt: Date.now(), reportedBy: 'Maya' },
    { id: '4', title: 'Exposed electrical wiring', room: 'Room 412', severity: 'high', status: 'open', createdAt: Date.now(), reportedBy: 'Tal' },
    { id: '5', title: 'Water leak from ceiling', room: 'Room 108', severity: 'medium', status: 'open', createdAt: Date.now(), reportedBy: 'Dana' },
    { id: '6', title: 'Missing door handle', room: 'Room 210', severity: 'low', status: 'open', createdAt: Date.now(), reportedBy: 'Yael' },
    { id: '7', title: 'Uneven floor tiles', room: 'Room 314', severity: 'low', status: 'in_progress', createdAt: Date.now(), reportedBy: 'Ron' },
    { id: '8', title: 'Faulty HVAC unit', room: 'Room 501', severity: 'medium', status: 'open', createdAt: Date.now(), reportedBy: 'Maya' },
    { id: '9', title: 'Scaffolding unstable', room: 'Floor 3', severity: 'high', status: 'open', createdAt: Date.now(), reportedBy: 'Tal' },
    { id: '10', title: 'Paint peeling on exterior', room: 'Floor 1', severity: 'low', status: 'resolved', createdAt: Date.now(), reportedBy: 'Yael' },
    { id: '11', title: 'Concrete not set properly', room: 'Room 002', severity: 'high', status: 'open', createdAt: Date.now(), reportedBy: 'Dana' },
    { id: '12', title: 'Missing safety signage', room: 'Floor 2', severity: 'medium', status: 'open', createdAt: Date.now(), reportedBy: 'Ron' },
]

const STATUS_ORDER = ['open', 'in_progress', 'resolved']

// Simulate teammate updating an issue every 5s
setInterval(() => {
    const openIssues = issues.filter(i => i.status !== 'resolved')
    if (!openIssues.length) return
    const issue = openIssues[Math.floor(Math.random() * openIssues.length)]
    const currentIdx = STATUS_ORDER.indexOf(issue.status)
    issue.status = STATUS_ORDER[Math.min(currentIdx + 1, STATUS_ORDER.length - 1)]

    wss.clients.forEach(c => c.readyState === 1 && c.send(
        JSON.stringify({ type: 'ISSUE_UPDATE', issue })
    ))
}, 5000)

wss.on('connection', ws => {
    setTimeout(() => {
        ws.send(JSON.stringify({ type: 'INIT', issues }))
    }, 100)  // give client time to set up onmessage
    console.log('client connected')

    ws.on('message', (data) => {
        const msg = JSON.parse(data)
        if (msg.type === 'NEW_ISSUE') {
            issues.push(msg.issue)
            wss.clients.forEach(c => c.readyState === 1 && c.send(
                JSON.stringify({ type: 'ISSUE_ADDED', issue: msg.issue })
            ))
        } else if (msg.type === 'UPDATE_STATUS') {
            const issue = issues.find(i => i.id === msg.issueId)
            if (issue) {
                issue.status = msg.status
                wss.clients.forEach(c => c.readyState === 1 && c.send(
                    JSON.stringify({ type: 'ISSUE_UPDATE', issue })
                ))
            }
        }
    })
})

console.log(`WS server on ws://localhost:${PORT}`)