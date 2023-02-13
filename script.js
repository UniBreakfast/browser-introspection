let introspectNow = () => {
  throw new Error('introspectNow() is not ready yet')
}
let inDetails = {}

!async function getReady() {
  const { introspect } = await import('./introspection.js')
  
  introspectNow = () => {
    inDetails = introspect()

    

    return inDetails
  }
}()
