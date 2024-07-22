const request = require('supertest');
const app     = require('../app');

test('app module should be defined', () => {
    expect(app).toBeDefined();
});

test('GET / should return 403', () => {
    return request(app)
        .get('/')
        .expect(403, {error: "No credentials sent!"});
});

test('GET / should return 401', () => {
    var token = 'Bearer .eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNjg1ODg2MTIyLCJzdWIiOiI3OGIyOGNkNi03OWM2LTQxZjgtOWNmMi00YmI3MWNhZWFjNGQiLCJlbWFpbCI6InNvcnJlbnRpbm9zYXJhMjhAZ21haWwuY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJlbWFpbCIsInByb3ZpZGVycyI6WyJlbWFpbCJdfSwidXNlcl9tZXRhZGF0YSI6e30sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoicGFzc3dvcmQiLCJ0aW1lc3RhbXAiOjE2ODU4ODI1MjJ9XSwic2Vzc2lvbl9pZCI6ImFjMTM0MWVlLTRkZjgtNDU5Zi05MTA4LTQ2ZDgzOGExYzRkZCJ9.GSjDhTG9IB59JXGWTYn6zdo_taAF-okWK3KVttTmWzQ'

    return request(app)
        .get('/')
        .set('Authorization', token)
        .expect(401); //Can return "Unauthorized", "jwt expired" or "invalid token"
});