const config = { 
  rootURI: (process.env.NODE_ENV === 'production') ? '[Production URL Here]' : 'http://localhost:7000',
  webSocketURI: (process.env.NODE_ENV === 'production') ? '[Production Socket URL Here]' : 'ws://localhost:7000'
}

export default config;