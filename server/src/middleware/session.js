const cookieOptions = () => ({httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:process.env.NODE_ENV==='production'?'none':'lax',path:'/',maxAge:7*24*60*60*1000,...(process.env.COOKIE_DOMAIN?{domain:process.env.COOKIE_DOMAIN}:{})});
export function setSessionCookie(res,token){res.cookie('elt_session',token,cookieOptions())}
export function clearSessionCookie(res){const options=cookieOptions();delete options.maxAge;res.clearCookie('elt_session',options)}
