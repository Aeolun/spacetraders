import { createRoot } from 'react-dom/client'
import { useState, useEffect, PropsWithChildren } from 'react'
import {
    type AnimatorGeneralProviderSettings,
    AnimatorGeneralProvider,
    Animator,
    BleepsProvider,
    GridLines,
    Dots,
    MovingLines,
    FrameSVGCorners,
    Text,
    Animated,
    aaVisibility, aa, useBleeps, FrameSVGNefrex, Illuminator
} from '@arwes/react';
import {BleepsManagerProps} from "@arwes/bleeps";
import {trpc} from "@front/lib/trpc";
import {Faction} from "spacetraders-sdk";

const animatorsSettings: AnimatorGeneralProviderSettings = {
    // Durations in seconds.
    duration: {
        enter: 0.2,
        exit: 0.2,
        stagger: 0.04
    }
};

const bleepsSettings: BleepsManagerProps = {
    // Shared global audio settings.
    master: {
        volume: 0.9
    },
    bleeps: {
        // A transition bleep sound to play when the user enters the app.
        intro: {
            sources: [
                { src: 'https://next.arwes.dev/assets/sounds/intro.mp3', type: 'audio/mpeg' }
            ]
        },
        // An interactive bleep sound to play when user clicks.
        click: {
            sources: [
                { src: 'https://next.arwes.dev/assets/sounds/click.mp3', type: 'audio/mpeg' }
            ]
        }
    }
};


const Background = () => {
    // The component can have its own Animator but for better composability,
    // it should merge with its closest parent Animator.
    return (
        <Animator merge duration={{ interval: 10 }}>
            {/* Some backgrounds require custom durations. */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: 'hsla(100deg, 100%, 3%)'
                }}
            >
                <GridLines lineColor='hsla(100deg, 100%, 75%, 0.05)' />
                <Dots color='hsla(100deg, 100%, 75%, 0.05)' />
                <MovingLines lineColor='hsla(100deg, 100%, 75%, 0.07)' />
            </div>
        </Animator>
    );
};

const Card = (props: PropsWithChildren<any>) => {
    const bleeps = useBleeps();

    return (
        <Animator merge combine manager='stagger'>
            <Animated
                style={{
                    position: 'relative',
                    display: 'block',
                    padding: '2rem',
                    textAlign: 'left',
                    color: '#fff',
                    ...props.style
                }}
                // Effects for entering and exiting animation transitions.
                animated={[aaVisibility(), aa('y', 24, 0)]}
                // Play a bleep when the card is clicked.
            >
                <Animator >
                    <FrameSVGCorners strokeWidth={2} />
                </Animator>
                <Animated style={{
                    zIndex: 3,
                    position: 'relative',
                    ...props.childStyle
                }}>
                    {props.children}
                </Animated>
            </Animated>
        </Animator>
    );
};

const Input = (props) => {
    const [focused, setFocus] = useState(false)
    return <input onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} style={{
        padding: '8px',
        background: focused ? 'hsla(150deg, 100%, 20%, 0.3)' : 'hsla(170deg, 100%, 20%, 0.2)',
        border: 0,
        outline: 0,
        color: 'white'
    }} {...props} />
}

const Button = (props: PropsWithChildren<any>) => {
    const bleeps = useBleeps();

    const { children, ...otherProps} = props

    return <Animated style={{
        width: '150px',
        display: 'inline-block',
        height: '45px',
        position: 'relative'
    }} onClick={() => bleeps.click?.play()}
    >
        <Animator>
            <FrameSVGNefrex className={'button'} style={{
                cursor: 'pointer'
            }} {...otherProps} />
        </Animator>
        <Animated style={{
            pointerEvents: 'none',
            textAlign: 'center',
            lineHeight: '45px'
        }}>
            <Text as={'div'}>
                {children}
            </Text>
        </Animated>
    </Animated>
}

const App = () => {
    const [active] = useState(true);
    const currentToken = localStorage.getItem('agent-token')
    const [selectedFaction, setSelectedFaction] = useState('')
    const [token, setToken] = useState('')
    const [factions, setFactions] = useState<Faction[]>([])

    useEffect(() => {
        trpc.getFactions.query().then(result => {
            setFactions(result)
        })
    }, [])

    return <AnimatorGeneralProvider {...animatorsSettings}>
        <BleepsProvider {...bleepsSettings}>
            <Animator>
                <Background />
                <Illuminator style={{
                    pointerEvents: 'none'
                }} color='hsl(0deg 0% 50% / 0.15)' />
            </Animator>

            <style>{`
            body {
                font-family: sans-serif;
            }
            select {
                background: hsla(170deg, 100%, 20%, 0.2);
                border: 0;
                color: white;
                padding: 8px;
            }
            .arwes-react-frames-framesvg path[data-name="decoration"] {
              color: hsla(150deg, 100%, 50%);
            }
            .arwes-react-frames-framesvg path[data-name="shape"] {
              color: hsla(150deg, 100%, 75%, 0.05)
            }
            .arwes-react-frames-framesvg.button path[data-name="shape"]:hover {
              color: hsla(150deg, 100%, 75%, 0.1)
            }
            code {
                line-break: anywhere;
            }
          `}</style>
            <Card style={{
                margin: '1rem',
            }}>
                    <Animator>
                    <Text as='h1'>
                        Spacetraders UI
                    </Text>
                </Animator>
                <Animator>
                    <Text>
                        Welcome to Spacetraders UI! You can register your token here, or enter an existing token to get a view of all your ships and others. The database behind this is shared, and while you won't be able to see data for ships unaffiliated with your token. You will be able to see other ships flying in-universe if the players are using this app and have that setting enabled.
                    </Text>
                </Animator>
            </Card>
            <Animated style={{
                display: 'flex',
                margin: '1rem',
                gap: '1rem',
                position: 'relative',
            }}>
                <Animated style={{
                    flex: 1,
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1em',
                }}>
                    <Card childStyle={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1em'
                    }}>
                        <label><Input type="checkbox" /> Share my ship positions with other players</label>
                        <Text as={'div'}><small>Changing this setting takes effect immediately if you already have a token set, or on game start if not.</small></Text>
                    </Card>
                    <Card childStyle={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1em'
                    }}>
                        <Text as={'h2'}>Register new agent</Text>
                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap'
                        }}>
                        {factions.map(faction => <img src={'factions/'+faction.symbol+'/emblem.png'} style={{
                            height: 96,
                            width: 96,
                            background: selectedFaction === faction.symbol ?'radial-gradient(circle, #588999 0%, rgba(0, 0, 0, 0) 75%) no-repeat' : 'transparent',
                            opacity: selectedFaction === faction.symbol ? 1 : 0.4
                        }} /> )}
                        </div>
                        <select placeholder={'-- faction --'} onChange={(e) => setSelectedFaction(e.currentTarget.value)}>
                            <option>-- faction --</option>
                            {factions.map(faction => <option value={faction.symbol}>{faction.name}</option> )}
                        </select>
                        <Input type="text" placeholder="Agent name" pattern="[a-zA-Z0-9]{3,14}}" />
                        <Input type="text" placeholder="Email" />
                        <Button>Play</Button>
                    </Card>
                </Animated>
                <Animated style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1em',

                }}>
                    {currentToken ? <Card childStyle={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1em'
                    }}>
                        <Text as={'h2'}>Current token</Text>
                        <Text as={'code'}>{currentToken}</Text>
                        <Button>Play</Button>
                    </Card> : null }
                    <Card childStyle={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1em'
                    }}>
                        <Text as={'h2'}>Existing token</Text>
                        <Text>Note that if you already have a token set, this token will override the existing one.</Text>
                        <Input type="text" value={token} onChange={(e) => setToken(e.currentTarget.value)} placeholder="Token" />
                        <Button onClick={() => {
                            console.log("buttonclick")
                            localStorage.setItem('agent-token', token)
                            window.location.href = '/play.html'
                        }}>Play</Button>
                    </Card>

                </Animated>
            </Animated>
        </BleepsProvider>
    </AnimatorGeneralProvider>
}

const root = createRoot(document.getElementById('app'))
root.render(<App />)