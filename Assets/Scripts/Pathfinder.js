//#pragma strict

public class Pathfinder extends Destructable
{
	//STATES
	public var my_state : NPC_state = NPC_state.idle;
	private var saved_state : NPC_state = NPC_state.idle;
	private var target_rotation : Quaternion;
	private var terrain_blocked : boolean = false;

	//STATISTICS
	public var damage : int = 10;
	private var speed : int = 2;
	private var reach : float = 3.0f;
	
	//RAYCAST
	private var width : float;
	private var length : float;
	private var distance : float = 1.0f;

	//COOLDOWN THRESHOLDS
	protected var search_cooldown : float = 2.0;
	protected var attack_cooldown : float = 1.0;
	private var follow_cooldown : float = 3.0;
	private var avoid_cooldown : float = 0.25f;
	private var walk_cooldown : float = 1.00f;

	//TIMERS
	protected var search_timer : float = 0.0;
	private var follow_timer : float = 0.0;
	protected var attack_timer : float = 0.0;
	private var avoid_timer : float = 0.0f;
	private var walk_timer : float = 0.0f;
	
	//CURRENTLY FOCUSED GAMEOBJECT
	public var target : GameObject = null;
	private var waypoint : GameObject;

	//SPAWNING TOWER
	protected var homeTower : GameObject = null;

	//CONVERSION
	public var conversionScript : MonoScript;
	
	//SAVED CHILDREN
	private var enemy_detector : Component;
	
	function Start()
	{
		max_health = 100;
		health = 100;
		enemy_detector = gameObject.GetComponentInChildren(Detect_Enemies);
		width = gameObject.GetComponent(Collider).bounds.size.x / 2;
		length = (gameObject.GetComponent(Collider).bounds.size.z / 2) + 1.0;
		target_rotation = gameObject.transform.rotation;
	}

	function FixedUpdate()
	{
	}
	
	function Update () 
	{
		transform.rotation = Quaternion.Slerp(transform.rotation, target_rotation, 4 * Time.deltaTime);
		//STATE SPECIFIC BEHAVIORS
		if(my_state == NPC_state.attacking)
		{
			Attack_State();
		}
		else if(my_state == NPC_state.moving)
		{
			Move_State();
			follow_timer += Time.deltaTime;
		}
		else if(my_state == NPC_state.hunting)
		{
			Hunt_State();
		}
		else if (my_state == NPC_state.idle)
		{
			search_timer += Time.deltaTime;
		}
		else if (my_state == NPC_state.avoiding)
		{
			Avoid_State();
		}
		else if (my_state == NPC_state.walking)
		{
			Walk_State();
		}
		Idle_State();
		attack_timer += Time.deltaTime;
	}

	//What to always do CHANGED
	function Idle_State()
	{
	}
	
	//What to do if the current state is attacking
	function Attack_State()
	{
		if (target == null)
		{
			target = waypoint;
			Change_State(NPC_state.moving);
		}
		else if (Vector3.Distance(transform.position, target.transform.position) < reach)
		{
			if(attack_timer >= attack_cooldown)
			{
				attack_timer = 0.0f;
				GetComponent.<Animation>().Stop();
				target_rotation = Quaternion.LookRotation(target.transform.position - Vector3(gameObject.transform.position.x, 0, gameObject.transform.position.z));
				//gameObject.transform.LookAt(Vector3(target.transform.position.x, gameObject.transform.position.y, target.transform.position.z));
				GetComponent.<Animation>().Play("BigAttack");
				doDamage();
			}
		}
		else
		{
			target = waypoint;
			Change_State(NPC_state.moving);
		}
	}
	
	//What to do if the current state is moving CHANGED
	function Move_State()
	{
		if (Detect_Collision())
		{
			Debug.Log("HIT!");
			Change_State(NPC_state.avoiding);
		}
		GetComponent.<Animation>().Play("run");
		transform.position = Vector3.MoveTowards(transform.position, Vector3(target.transform.position.x, transform.position.y, target.transform.position.z), speed * Time.deltaTime);
	}
	
	//What to do if the current state is moving CHANGED
	function Walk_State()
	{
		walk_timer += Time.deltaTime;
		if (walk_timer >= walk_cooldown)
		{
			walk_timer = 0.0f;
			Change_State(NPC_state.moving);
		}
		else
		{
			GetComponent.<Animation>().Play("run");
			transform.position = Vector3.MoveTowards(transform.position, Vector3(target.transform.position.x, transform.position.y, target.transform.position.z), (speed / 2) * Time.deltaTime);
		}
	}
	
	//What to do if the current state is hunting CHANGED
	function Hunt_State()
	{
		
	}
	
	function Avoid_State()
	{
		avoid_timer += Time.deltaTime;
		if (avoid_timer >= avoid_cooldown)
		{
			avoid_timer = 0.0f;
			Change_State(saved_state);
			target_rotation = Quaternion.LookRotation(target.transform.position - Vector3(gameObject.transform.position.x, 0, gameObject.transform.position.z));
		}
		else
		{
			GetComponent.<Animation>().Play("run");
			transform.position += transform.forward * Time.deltaTime * speed;
		}
	}
	
	//To switch states this function must be gone through CHANGED
	function Change_State(new_state : NPC_state)
	{
		switch (new_state)
		{
			case NPC_state.idle:
				my_state = NPC_state.idle;
				gameObject.GetComponentInChildren(DetectTowers).SendMessage("ObjectDead");
				break;
			case NPC_state.moving:
				my_state = NPC_state.moving;
				gameObject.GetComponentInChildren(DetectTowers).SendMessage("ObjectDead");
				break;
			case NPC_state.attacking:
				my_state = NPC_state.attacking;
				break;
			case NPC_state.hunting:
				saved_state = my_state;
				my_state = NPC_state.hunting;
				gameObject.GetComponentInChildren(DetectTowers).SendMessage("ObjectDead");
				break;
			case NPC_state.avoiding:
				saved_state = my_state;
				my_state = NPC_state.avoiding;
				gameObject.GetComponentInChildren(DetectTowers).SendMessage("ObjectDead");
				break;
			case NPC_state.walking:
				my_state = NPC_state.walking;
				gameObject.GetComponentInChildren(DetectTowers).SendMessage("ObjectDead");
				break;
		}
	}
	
	function Detect_Collision() : boolean
	{
		if (Front_Ray())
		{
			var right_distance : float = Vector3.Distance((gameObject.transform.position + gameObject.transform.forward + gameObject.transform.right), target.transform.position);
			var left_distance : float = Vector3.Distance((gameObject.transform.position + gameObject.transform.forward - gameObject.transform.right), target.transform.position);
			if (right_distance < left_distance)
			{
				if(!Right_Ray())
				{
					target_rotation = Quaternion.LookRotation(gameObject.transform.forward + gameObject.transform.right);
				}
				else if (!Left_Ray())
				{
					target_rotation = Quaternion.LookRotation(gameObject.transform.forward - gameObject.transform.right);
				}
				else if (terrain_blocked)
				{
					terrain_blocked = false;
					target_rotation = Quaternion.LookRotation(-gameObject.transform.forward);
				}
				else
				{
					Change_State(NPC_state.walking);
					return false;
				}
			}
			else
			{
				if (!Left_Ray())
				{
					target_rotation = Quaternion.LookRotation(gameObject.transform.forward - gameObject.transform.right);
				}
				else if(!Right_Ray())
				{
					target_rotation = Quaternion.LookRotation(gameObject.transform.forward + gameObject.transform.right);
				}
				else if (terrain_blocked)
				{
					terrain_blocked = false;
					target_rotation = Quaternion.LookRotation(-gameObject.transform.forward);
				}
				else
				{
					Change_State(NPC_state.walking);
					return false;
				}
			}
			return true;
		}
		return false;
	}
	
	function Right_Ray() : boolean
	{
		var hit: RaycastHit;
		return Physics.SphereCast (transform.position + Vector3(0, .5, 0), width, transform.forward + transform.right, hit, distance);
	}
	
	function Left_Ray() : boolean
	{
		var hit: RaycastHit;
		return Physics.SphereCast (transform.position + Vector3(0, .5, 0), width, transform.forward - transform.right, hit, distance);
	}
	
	function Front_Ray() : boolean
	{
		for (var object_hit : RaycastHit in Physics.SphereCastAll (transform.position + Vector3(0, .5, 0) + (transform.forward * .5), width, Vector3.Scale((target.transform.position - transform.position), Vector3(1, 0, 1)), distance))
		{
			if (object_hit.transform.gameObject.tag == "Enemy")
			{
				Debug.Log(object_hit.transform.gameObject.tag);
				return true;
			}
			else if (object_hit.transform.gameObject.tag == "Terrain")
			{
				Debug.Log(object_hit.transform.gameObject.tag);
				terrain_blocked = true;
				return true;
			}
		}
		return false;
	}
	
	function doDamage()
	{
		target.GetComponent(Destructable).SendMessage("Take_Damage", damage);
	}

	function Attack (the_target : GameObject)
	{
		waypoint = target;
		target = the_target;
		Change_State(NPC_state.attacking);
	}

	function loseTarget()
	{
		target = null;
		Change_State(NPC_state.idle);
	}
	
	function waypointReached(nextWaypoint : GameObject)
	{
		target = nextWaypoint;
		target_rotation = Quaternion.LookRotation(target.transform.position - Vector3(gameObject.transform.position.x, 0, gameObject.transform.position.z));
		//gameObject.transform.LookAt(target.transform);
		Change_State(NPC_state.moving);
		gameObject.GetComponentInChildren(DetectTowers).SendMessage("ObjectDead");
	}
}