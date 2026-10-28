import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';

import 'firebase_options.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);
  runApp(const EasyLifeToolsApp());
}

class EasyLifeToolsApp extends StatelessWidget {
  const EasyLifeToolsApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Easy Life Tools',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF3157D5)),
        useMaterial3: true,
        inputDecorationTheme: const InputDecorationTheme(
          border: OutlineInputBorder(),
        ),
      ),
      home: const AuthGate(),
    );
  }
}

class AuthGate extends StatelessWidget {
  const AuthGate({super.key});

  @override
  Widget build(BuildContext context) {
    return StreamBuilder<User?>(
      stream: FirebaseAuth.instance.authStateChanges(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Scaffold(body: Center(child: CircularProgressIndicator()));
        }
        final user = snapshot.data;
        return user == null ? const SignInPage() : HomePage(user: user);
      },
    );
  }
}

class SignInPage extends StatefulWidget {
  const SignInPage({super.key});

  @override
  State<SignInPage> createState() => _SignInPageState();
}

class _SignInPageState extends State<SignInPage> {
  final _email = TextEditingController();
  final _password = TextEditingController();
  bool _busy = false;
  String? _error;

  @override
  void dispose() {
    _email.dispose();
    _password.dispose();
    super.dispose();
  }

  Future<void> _run(Future<UserCredential> Function() action) async {
    setState(() {
      _busy = true;
      _error = null;
    });
    try {
      await action();
    } on FirebaseAuthException catch (e) {
      setState(() => _error = e.message ?? 'Authentication failed. Please try again.');
    } catch (_) {
      setState(() => _error = 'Something went wrong. Please try again.');
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 420),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  const Icon(Icons.bolt_rounded, size: 56, color: Color(0xFF3157D5)),
                  const SizedBox(height: 12),
                  Text('Easy Life Tools', textAlign: TextAlign.center,
                      style: Theme.of(context).textTheme.headlineMedium?.copyWith(fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),
                  const Text('Your everyday tools, all in one place.', textAlign: TextAlign.center),
                  const SizedBox(height: 32),
                  TextField(controller: _email, keyboardType: TextInputType.emailAddress,
                      autofillHints: const [AutofillHints.email], decoration: const InputDecoration(labelText: 'Email')),
                  const SizedBox(height: 12),
                  TextField(controller: _password, obscureText: true,
                      autofillHints: const [AutofillHints.password], decoration: const InputDecoration(labelText: 'Password')),
                  if (_error != null) ...[
                    const SizedBox(height: 12),
                    Text(_error!, style: TextStyle(color: Theme.of(context).colorScheme.error)),
                  ],
                  const SizedBox(height: 16),
                  FilledButton(
                    onPressed: _busy ? null : () => _run(() => FirebaseAuth.instance.signInWithEmailAndPassword(
                      email: _email.text.trim(), password: _password.text)),
                    child: _busy ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2))
                        : const Text('Sign in'),
                  ),
                  OutlinedButton(
                    onPressed: _busy ? null : () => _run(() => FirebaseAuth.instance.createUserWithEmailAndPassword(
                      email: _email.text.trim(), password: _password.text)),
                    child: const Text('Create account'),
                  ),
                  const SizedBox(height: 8),
                  OutlinedButton.icon(
                    icon: const Icon(Icons.account_circle_outlined),
                    onPressed: _busy ? null : () => _run(() => FirebaseAuth.instance.signInWithProvider(GoogleAuthProvider())),
                    label: const Text('Continue with Google'),
                  ),
                  TextButton(
                    onPressed: _busy ? null : () async {
                      final email = _email.text.trim();
                      if (email.isEmpty) {
                        setState(() => _error = 'Enter your email first to reset your password.');
                        return;
                      }
                      try {
                        await FirebaseAuth.instance.sendPasswordResetEmail(email: email);
                        if (mounted) setState(() => _error = 'Password reset email sent if the account exists.');
                      } on FirebaseAuthException catch (e) {
                        if (mounted) setState(() => _error = e.message ?? 'Could not send reset email.');
                      }
                    },
                    child: const Text('Forgot password?'),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class HomePage extends StatelessWidget {
  const HomePage({super.key, required this.user});
  final User user;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Easy Life Tools'),
        actions: [IconButton(
          tooltip: 'Sign out',
          onPressed: () => FirebaseAuth.instance.signOut(),
          icon: const Icon(Icons.logout),
        )],
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(mainAxisSize: MainAxisSize.min, children: [
            const Icon(Icons.check_circle_outline, size: 56),
            const SizedBox(height: 16),
            Text('You are signed in', style: Theme.of(context).textTheme.headlineSmall),
            const SizedBox(height: 8),
            Text(user.email ?? user.displayName ?? user.uid, textAlign: TextAlign.center),
            const SizedBox(height: 12),
            const Text('Mobile foundation is ready. Shared tools and API-backed data are the next implementation stage.',
                textAlign: TextAlign.center),
          ]),
        ),
      ),
    );
  }
}
